import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useState } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  View,
} from "react-native";

import { AppButton } from "@/components/app-button";
import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { Inset } from "@/components/inset";
import { InstructionStrip, type StatusTone } from "@/components/instruction-strip";
import { Screen } from "@/components/screen";
import { ScreenIntro } from "@/components/screen-intro";
import {
  gutter,
  makeStyles,
  minTouchTarget,
  spacing,
  typography,
  useColors,
} from "@/constants/theme";
import {
  callAI,
  parseJsonReply,
  UNEXPECTED_REPLY_MESSAGE,
} from "@/services/ai";
import type {
  ScamCheckImage,
  ScamCheckInput,
  ScamCheckResult,
  ScamVerdict,
} from "@/types/scam-check";

// Tracks one checkForScam() call so the UI can show loading, the verdict,
// or the error. Kept separate from the input state so "Check another" can
// reset both together.
type ScamCheckStatus = "idle" | "loading" | "success" | "error";

type ScamCheckState = {
  status: ScamCheckStatus;
  result: ScamCheckResult | null;
  error: string | null;
};

const initialCheckState: ScamCheckState = {
  status: "idle",
  result: null,
  error: null,
};

// Plain-language framing for each verdict and the instruction-strip tone
// that carries its advice: danger for a likely scam, success for likely
// safe, warning for a genuine "can't tell."
const verdictCopy: Record<
  ScamVerdict,
  { label: string; advice: string; tone: StatusTone }
> = {
  likely_scam: {
    label: "This looks like a scam",
    advice: "Don't reply, click links, or send money.",
    tone: "danger",
  },
  likely_safe: {
    label: "This looks safe",
    advice: "Still, never share passwords or codes you didn't ask for.",
    tone: "success",
  },
  uncertain: {
    label: "Hard to say for sure",
    advice: "Contact the sender using a number or website you already trust.",
    tone: "warning",
  },
};

const SCAM_CHECK_SYSTEM = `You help older adults spot scams. The user will share a message they received and/or screenshots of it. Judge whether it is likely a scam.
Reply with only JSON, no other text:
{"verdict": "likely_scam" | "likely_safe" | "uncertain", "confidence": number from 0 to 1, "explanation": string}
Write the explanation in two or three short, plain sentences with no jargon.`;

async function checkForScam(
  input: ScamCheckInput
): Promise<ScamCheckResult> {
  let reply: string;
  try {
    reply = await callAI({
      system: SCAM_CHECK_SYSTEM,
      prompt: input.text.trim() || "(No text — see the attached screenshots.)",
      images: input.images,
    });
  } catch (caught) {
    // Network/model failures carry technical messages; show a plain one.
    console.warn("checkForScam: callAI failed", caught);
    Alert.alert("Couldn't reach the checker. Please try again.");
  }
  return toScamCheckResult(parseJsonReply(reply));
}

// The reply drives verdictCopy lookups and the confidence %, so reject
// anything that doesn't match ScamCheckResult rather than render garbage.
function toScamCheckResult({
  verdict,
  confidence,
  explanation,
}: Record<string, unknown>): ScamCheckResult {
  if (
    typeof verdict !== "string" ||
    !Object.hasOwn(verdictCopy, verdict) ||
    typeof confidence !== "number" ||
    confidence < 0 ||
    confidence > 1 ||
    typeof explanation !== "string"
  ) {
    throw new Error(UNEXPECTED_REPLY_MESSAGE);
  }
  return { verdict: verdict as ScamVerdict, confidence, explanation };
}

// Route: /check — the "Scam Checker" tab.
export default function ScamChecker() {
  const styles = useStyles();
  const colors = useColors();
  const [text, setText] = useState("");
  const [images, setImages] = useState<ScamCheckImage[]>([]);
  const [checkState, setCheckState] = useState<ScamCheckState>(
    initialCheckState
  );
  const { status, result, error } = checkState;

  const pickImage = useCallback(async () => {
    // Must request permission before launching the picker, and must check
    // `.granted` rather than assuming the promise resolving means yes.
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Allow photo library access to attach a screenshot."
      );
      return;
    }

    // SDK 57: mediaTypes takes an array of strings (e.g. ["images"]), not the
    // old MediaTypeOptions enum.
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (pickerResult.canceled || !pickerResult.assets) {
      return;
    }

    // Append rather than replace, since allowsMultipleSelection + repeated
    // taps on "Add a screenshot" should build up one batch of evidence.
    setImages((current) => [
      ...current,
      ...pickerResult.assets.map((asset) => ({
        uri: asset.uri,
        width: asset.width,
        height: asset.height,
      })),
    ]);
  }, []);

  const removeImage = useCallback((uri: string) => {
    setImages((current) => current.filter((image) => image.uri !== uri));
  }, []);

  const handleSubmit = useCallback(async () => {
    setCheckState({ status: "loading", result: null, error: null });

    try {
      const checkResult = await checkForScam({ text, images });
      setCheckState({ status: "success", result: checkResult, error: null });
    } catch (caught) {
      // checkForScam throws plain Errors today; the instanceof check is just
      // a safe fallback in case that ever changes.
      setCheckState({
        status: "error",
        result: null,
        error:
          caught instanceof Error ? caught.message : "Something went wrong.",
      });
    }
  }, [text, images]);

  const handleReset = useCallback(() => {
    setCheckState(initialCheckState);
    setText("");
    setImages([]);
  }, []);

  // Need at least some text or one image to send, and can't resubmit mid-check.
  const isLoading = status === "loading";
  const hasInput = text.trim().length > 0 || images.length > 0;
  const canSubmit = hasInput && !isLoading;
  const verdict = result ? verdictCopy[result.verdict] : null;

  // Results appear below the fold of a long form; announce them so screen
  // reader users (iOS has no live regions) know the check finished.
  useEffect(() => {
    if (status === "success" && verdict) {
      AccessibilityInfo.announceForAccessibility(verdict.label);
    } else if (status === "error" && error) {
      AccessibilityInfo.announceForAccessibility(error);
    }
  }, [status, verdict, error]);

  return (
    <Screen>
      <ScreenIntro
        title="Not sure about something?"
        subtitle="Paste the message or add a screenshot, and we'll take a look."
      />

      <Card>
        <View style={styles.field}>
          <AppText variant="bodyStrong">The message</AppText>
          <TextInput
            style={styles.textInput}
            multiline
            value={text}
            onChangeText={setText}
            placeholder="e.g. a text, email, or DM you received"
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.primary}
            editable={!isLoading}
            accessibilityLabel="The message"
          />
        </View>

        {images.length > 0 && (
          <ScrollView
            horizontal
            style={styles.imageScroller}
            contentContainerStyle={styles.imageList}
          >
            {images.map((image, i) => (
              <View key={image.uri} style={styles.imageItem}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.thumbnail}
                  accessibilityLabel={`Screenshot ${i + 1}`}
                />
                <AppButton
                  title="Remove"
                  variant="tonal"
                  onPress={() => removeImage(image.uri)}
                  disabled={isLoading}
                  fullWidth
                />
              </View>
            ))}
          </ScrollView>
        )}

        <AppButton
          title="Add a screenshot"
          icon="addPhoto"
          variant="tonal"
          onPress={pickImage}
          disabled={isLoading}
        />
      </Card>

      <Inset style={styles.submit}>
        <AppButton
          title="Check for Scam"
          icon="search"
          onPress={handleSubmit}
          disabled={!canSubmit}
          fullWidth
        />
        {!hasInput && (
          <AppText variant="callout" tone="textMuted" style={styles.helper}>
            Paste a message or add a screenshot first.
          </AppText>
        )}
      </Inset>

      {isLoading && (
        <Inset style={styles.statusRow}>
          <ActivityIndicator color={colors.primary} />
          <AppText tone="textMuted">Reading your message...</AppText>
        </Inset>
      )}

      {status === "error" && error && (
        <InstructionStrip tone="warning" label="That didn't work">
          {error}
        </InstructionStrip>
      )}

      {status === "success" && result && verdict && (
        <Card>
          <View style={styles.verdictHead}>
            <AppText variant="title" accessibilityRole="header">
              {verdict.label}
            </AppText>
            <AppText variant="callout" tone="textMuted">
              How sure we are: {Math.round(result.confidence * 100)}%
            </AppText>
          </View>
          <AppText>{result.explanation}</AppText>
          <InstructionStrip tone={verdict.tone} bleed>
            {verdict.advice}
          </InstructionStrip>
          <AppButton
            title="Check another"
            icon="refresh"
            variant="tonal"
            onPress={handleReset}
            fullWidth
          />
        </Card>
      )}
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  field: {
    gap: spacing.sm,
  },
  textInput: {
    ...typography.body,
    minHeight: 160,
    textAlignVertical: "top",
    color: c.text,
    backgroundColor: c.background,
    borderWidth: 2,
    borderColor: c.borderStrong,
    padding: spacing.md,
  },
  // Bleeds past the Card's padding so thumbnails scroll to the screen edge.
  imageScroller: {
    marginHorizontal: -gutter,
  },
  imageList: {
    gap: spacing.md,
    paddingHorizontal: gutter,
  },
  imageItem: {
    width: 140,
    gap: spacing.sm,
  },
  thumbnail: {
    width: 140,
    height: 140,
    borderWidth: 1,
    borderColor: c.border,
  },
  statusRow: {
    minHeight: minTouchTarget,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  submit: {
    gap: spacing.sm,
  },
  helper: {
    textAlign: "center",
  },
  verdictHead: {
    gap: spacing.xs,
  },
}));
