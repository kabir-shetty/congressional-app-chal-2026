import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { AppText } from "@/components/app-text";
import { LeafCard } from "@/components/leaf-card";
import { FadeIn, PulseDots } from "@/components/motion";
import { PillButton } from "@/components/pill-button";
import { Screen } from "@/components/screen";
import { ScreenHeader } from "@/components/screen-header";
import { StepList } from "@/components/step-list";
import { VerdictPanel, verdictStyle } from "@/components/verdict-panel";
import {
  AI_SCAM_TOPICS,
  isAiScamTopicId,
} from "@/constants/ai-scam-topics";
import {
  callAI,
  MAX_AI_IMAGES,
  parseJsonReply,
  UNEXPECTED_REPLY_MESSAGE,
} from "@/services/ai";
import { makeStyles, useColors } from "@/theme/colors";
import { leaf, minTouchTarget, pressedOpacity } from "@/theme/shape";
import { typography } from "@/theme/type";
import {
  isScamVerdict,
  type ScamCheckImage,
  type ScamCheckInput,
  type ScamCheckResult,
  type ScamSign,
} from "@/types/scam-check";

// input: filling in the form. checking: waiting on the AI. result: verdict
// shown. Failures have no stage; they log + show a native alert.
type Stage = "input" | "checking" | "result";

// Upper bound on list lengths from the model, so a runaway reply can't
// bury the verdict.
const MAX_LIST_ITEMS = 4;

// "Or try an example": fills the text box so a first-time user (or a judge)
// can see a check without finding a real message.
const SAMPLES = [
  {
    label: '"Grandma, it\'s Josh. I\'m in trouble…"',
    text: "Grandma it's Josh. I got in a car accident and I'm at the police station. Please don't tell Mom. The lawyer says I need $2,000 for bail today and gift cards are the fastest way. Can you help?",
  },
  {
    label: "Pharmacy refill reminder",
    text: "Maple Street Pharmacy: Your prescription is ready for pickup. Questions? Call the number on your bottle label.",
  },
  {
    label: '"Hi Mom, this is my new number"',
    text: "Hi Mom, I dropped my phone in the sink so this is my new number. Save it! Text me back when you can.",
  },
];

const SCAM_CHECK_SYSTEM = `You help older adults spot scams, including AI-powered ones (cloned voices, fake photos or videos, AI-written messages). The user will share a message they received and/or screenshots of it. Judge whether it is likely a scam.
Reply with only JSON, no other text:
{"verdict": "likely_scam" | "likely_safe" | "uncertain", "confidence": number from 0 to 1, "action": string, "signs": [{"title": string, "detail": string}], "steps": [string], "topic": "voice" | "photos" | "writing" | "signs"}
- action: the one most important thing to do now, one short sentence (e.g. "Don't reply and don't buy gift cards.").
- signs: 1 to 3 things you noticed in the message. title is one short sentence ("It asks for gift cards."); detail is one or two plain sentences explaining why it matters.
- steps: 1 to 3 short, concrete steps to take now, most important first. Point people to numbers or apps they already trust, never to anything in the message.
- topic: "voice" if it involves a call or voice message from someone in trouble, "photos" for pictures, videos, or online friends, "writing" for polished official-looking messages, otherwise "signs".
Use plain, warm, everyday words with no jargon. Never overstate certainty; use "uncertain" when there isn't enough to go on.`;

async function checkForScam(input: ScamCheckInput): Promise<ScamCheckResult> {
  const reply = await callAI({
    system: SCAM_CHECK_SYSTEM,
    prompt: input.text.trim() || "(No text — see the attached screenshots.)",
    images: input.images,
  });
  return toScamCheckResult(parseJsonReply(reply));
}

function isNonBlank(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function toSigns(value: unknown): ScamSign[] | null {
  if (!Array.isArray(value)) return null;
  const signs = value.filter(
    (sign): sign is ScamSign =>
      !!sign && isNonBlank(sign.title) && isNonBlank(sign.detail)
  );
  return signs.length > 0 ? signs.slice(0, MAX_LIST_ITEMS) : null;
}

function toSteps(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const steps = value.filter(isNonBlank);
  return steps.length > 0 ? steps.slice(0, MAX_LIST_ITEMS) : null;
}

// The reply drives every part of the result screen, so reject anything that
// doesn't match ScamCheckResult rather than render garbage. An unknown topic
// only picks the "learn more" link, so it falls back instead of failing.
function toScamCheckResult(data: Record<string, unknown>): ScamCheckResult {
  const { verdict, confidence, action, topic } = data;
  const signs = toSigns(data.signs);
  const steps = toSteps(data.steps);
  if (
    !isScamVerdict(verdict) ||
    typeof confidence !== "number" ||
    confidence < 0 ||
    confidence > 1 ||
    !isNonBlank(action) ||
    !signs ||
    !steps
  ) {
    throw new Error(UNEXPECTED_REPLY_MESSAGE);
  }
  return {
    verdict,
    confidence,
    action,
    signs,
    steps,
    topic: isAiScamTopicId(topic) ? topic : "signs",
  };
}

// Confidence in words, never a percentage. "Can't tell" never claims more.
function sureInWords({ verdict, confidence }: ScamCheckResult) {
  if (verdict === "uncertain") return "Not sure either way";
  return confidence >= 0.85 ? "Very likely" : "Fairly sure";
}

// Route: /check — the "Scam Checker" tab.
export default function ScamChecker() {
  const styles = useStyles();
  const colors = useColors();
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);
  const [images, setImages] = useState<ScamCheckImage[]>([]);
  const [stage, setStage] = useState<Stage>("input");
  const [result, setResult] = useState<ScamCheckResult | null>(null);

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

    // mediaTypes takes an array of strings (e.g. ["images"]), not the old
    // MediaTypeOptions enum.
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: MAX_AI_IMAGES - images.length,
      quality: 1,
    });

    if (pickerResult.canceled || !pickerResult.assets) {
      return;
    }

    // Append rather than replace, since allowsMultipleSelection + repeated
    // taps on "Add screenshot" should build up one batch of evidence.
    // Sliced too, since not every platform honors selectionLimit.
    setImages((current) =>
      [
        ...current,
        ...pickerResult.assets.map((asset) => ({
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
        })),
      ].slice(0, MAX_AI_IMAGES)
    );
  }, [images.length]);

  const removeImage = useCallback((uri: string) => {
    setImages((current) => current.filter((image) => image.uri !== uri));
  }, []);

  const handleSubmit = useCallback(async () => {
    setStage("checking");
    try {
      setResult(await checkForScam({ text, images }));
      setStage("result");
    } catch (caught) {
      // Full detail goes to the console (logged whole so the stack and cause
      // survive); the user gets one plain native alert, and the form stays
      // filled in so they can just tap "Check for Scam" again.
      console.error("Scam check failed:", caught);
      Alert.alert(
        "Couldn't check that",
        "Please check your internet connection, then try again."
      );
      setStage("input");
    }
  }, [text, images]);

  const handleReset = useCallback(() => {
    setStage("input");
    setResult(null);
    setText("");
    setImages([]);
  }, []);

  const canCheck = text.trim().length > 0 || images.length > 0;
  const topic = result
    ? AI_SCAM_TOPICS.find((t) => t.id === result.topic)
    : undefined;

  // iOS has no live regions, so announce stage changes explicitly (Android
  // already reads the checking state's live region).
  useEffect(() => {
    if (stage === "checking") {
      if (Platform.OS === "ios") {
        AccessibilityInfo.announceForAccessibility("Reading the message.");
      }
    } else if (stage === "result" && result) {
      const { label, headline } = verdictStyle[result.verdict];
      AccessibilityInfo.announceForAccessibility(`${label}. ${headline}`);
    }
  }, [stage, result]);

  return (
    <Screen scrollKey={stage}>
      {stage === "input" && (
        <FadeIn style={layout.stage}>
          <ScreenHeader
            title="Scam Checker"
            subtitle="Paste the message or add a screenshot of it."
          />

          <View style={layout.field}>
            <AppText variant="calloutStrong">The message</AppText>
            <TextInput
              style={[styles.textInput, focused && styles.textInputFocused]}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              multiline
              value={text}
              onChangeText={setText}
              placeholder="Paste the message here"
              placeholderTextColor={colors.muted}
              selectionColor={colors.accent}
              accessibilityLabel="The message"
            />
          </View>

          <PillButton
            title="Add screenshot"
            variant="check"
            size="small"
            onPress={pickImage}
            disabled={images.length >= MAX_AI_IMAGES}
            accessibilityHint={`Up to ${MAX_AI_IMAGES} screenshots.`}
          />

          {images.length > 0 && (
            <View style={layout.shots}>
              {images.map((image, i) => (
                <View key={image.uri} style={layout.shot}>
                  <Image
                    source={{ uri: image.uri }}
                    style={[leaf, styles.thumbnail]}
                    accessibilityLabel={`Screenshot ${i + 1}`}
                  />
                  <Pressable
                    onPress={() => removeImage(image.uri)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove screenshot ${i + 1}`}
                    hitSlop={6}
                    style={({ pressed }) => [
                      layout.remove,
                      pressed && layout.pressed,
                    ]}
                  >
                    <AppText
                      variant="smallStrong"
                      tone="scamInk"
                      style={layout.underline}
                    >
                      Remove
                    </AppText>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          <PillButton
            title="Check for Scam"
            variant="check"
            size="large"
            onPress={handleSubmit}
            disabled={!canCheck}
            accessibilityHint={
              canCheck ? undefined : "Paste a message or add a screenshot first."
            }
          />

          <View style={styles.examples}>
            <AppText variant="calloutStrong" style={layout.examplesTitle}>
              Or try an example
            </AppText>
            {SAMPLES.map((sample) => (
              <Pressable
                key={sample.label}
                onPress={() => setText(sample.text)}
                accessibilityRole="button"
                accessibilityHint="Puts this example in the message box."
                style={({ pressed }) => [
                  styles.example,
                  pressed && layout.pressed,
                ]}
              >
                <AppText variant="callout">{sample.label}</AppText>
              </Pressable>
            ))}
          </View>
        </FadeIn>
      )}

      {stage === "checking" && (
        <View style={layout.checking} accessibilityLiveRegion="polite">
          <PulseDots color={colors.check} />
          <AppText
            variant="statusTitle"
            accessibilityRole="header"
            style={layout.center}
          >
            Processing the message…
          </AppText>
          <AppText tone="muted" style={layout.center}>
            While you wait: you don&apos;t have to reply to anyone right now.
          </AppText>
        </View>
      )}

      {stage === "result" && result && (
        <FadeIn style={layout.result}>
          <VerdictPanel
            verdict={result.verdict}
            action={result.action}
            sure={sureInWords(result)}
          />

          <View style={layout.section}>
            <AppText variant="heading" accessibilityRole="header">
              What we noticed
            </AppText>
            {result.signs.map((sign, i) => (
              <LeafCard key={i} border="line" style={layout.sign}>
                <AppText variant="bodyStrong">{sign.title}</AppText>
                <AppText variant="callout" tone="muted">
                  {sign.detail}
                </AppText>
              </LeafCard>
            ))}
          </View>

          <View style={layout.section}>
            <AppText variant="heading" accessibilityRole="header">
              What to do now
            </AppText>
            <StepList steps={result.steps} />
          </View>

          <View style={layout.actions}>
            <PillButton
              title="Check another message"
              variant="check"
              onPress={handleReset}
            />
            {topic && (
              <PillButton
                title={topic.learnLabel}
                variant="outline"
                size="small"
                onPress={() =>
                  router.navigate({
                    pathname: "/ai-scams",
                    params: { topic: topic.id },
                  })
                }
              />
            )}
          </View>

          <AppText variant="small" tone="muted">
            This is a second opinion, not a guarantee. When in doubt, call the
            person or company on a number you already trust.
          </AppText>
        </FadeIn>
      )}
    </Screen>
  );
}

const layout = StyleSheet.create({
  stage: { gap: 20 },
  field: { gap: 8 },
  shots: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  shot: {
    alignItems: "center",
    gap: 6,
  },
  remove: {
    minHeight: 44,
    justifyContent: "center",
  },
  underline: { textDecorationLine: "underline" },
  pressed: { opacity: pressedOpacity },
  examplesTitle: { paddingTop: 14 },
  checking: {
    flex: 1,
    minHeight: 480,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 10,
  },
  center: { textAlign: "center" },
  result: { gap: 22 },
  section: { gap: 12 },
  sign: {
    padding: 16,
    gap: 6,
  },
  actions: {
    gap: 12,
    paddingTop: 4,
  },
});

const useStyles = makeStyles((c) => ({
  textInput: {
    ...typography.body,
    ...leaf,
    // About six lines, like the prototype's rows=6.
    minHeight: 206,
    textAlignVertical: "top",
    padding: 16,
    borderWidth: 2,
    borderColor: c.lineStrong,
    backgroundColor: c.surface,
    color: c.ink,
  },
  textInputFocused: {
    borderColor: c.accent,
  },
  thumbnail: {
    width: 96,
    height: 150,
    borderWidth: 2,
    borderColor: c.lineStrong,
    backgroundColor: c.soft,
  },
  examples: {
    gap: 10,
    paddingTop: 6,
    borderTopWidth: 2,
    borderTopColor: c.line,
  },
  example: {
    minHeight: minTouchTarget,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: c.line,
    backgroundColor: c.surface,
  },
}));
