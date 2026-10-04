import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { AppButton } from "@/components/app-button";
import { BodyText } from "@/components/body-text";
import { HeadingText } from "@/components/heading-text";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useScamCheck } from "@/hooks/use-scam-check";
import type { ScamCheckImage, ScamVerdict } from "@/types/scam-check";

// Plain-language framing for each verdict, and the spine color that marks
// it — danger for a likely scam, success for likely safe, border for a
// genuine "can't tell."
const verdictCopy: Record<ScamVerdict, { label: string; color: string }> = {
  likely_scam: { label: "This looks like a scam", color: colors.danger },
  likely_safe: { label: "This looks safe", color: colors.success },
  uncertain: { label: "Hard to say for sure", color: colors.border },
};

// Route: /check — linked from the landing page's "Scam Checker" menu item.
export default function ScamChecker() {
  const [text, setText] = useState("");
  const [images, setImages] = useState<ScamCheckImage[]>([]);
  const { status, result, error, submit, reset } = useScamCheck();

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
    // taps on "Add Screenshot" should build up one batch of evidence.
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

  const handleSubmit = useCallback(() => {
    submit({ text, images });
  }, [submit, text, images]);

  const handleReset = useCallback(() => {
    reset();
    setText("");
    setImages([]);
  }, [reset]);

  // Need at least some text or one image to send, and can't resubmit mid-check.
  const canSubmit =
    (text.trim().length > 0 || images.length > 0) && status !== "loading";

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.intro}>
        <HeadingText style={styles.title}>Not sure about something?</HeadingText>
        <BodyText style={styles.subtitle}>
          Paste the message or describe what happened.
        </BodyText>
      </View>

      <TextInput
        style={styles.textInput}
        multiline
        value={text}
        onChangeText={setText}
        placeholder="e.g. a text, email, or DM you received"
        placeholderTextColor={colors.secondary}
        editable={status !== "loading"}
      />

      <View style={styles.imageSection}>
        <View style={styles.startAction}>
          <AppButton
            title="Add Screenshot"
            onPress={pickImage}
            disabled={status === "loading"}
          />
        </View>

        {images.length > 0 && (
          <ScrollView horizontal contentContainerStyle={styles.imageList}>
            {images.map((image) => (
              <View key={image.uri} style={styles.imageItem}>
                <Image source={{ uri: image.uri }} style={styles.thumbnail} />
                <AppButton
                  title="Remove"
                  variant="danger"
                  onPress={() => removeImage(image.uri)}
                  disabled={status === "loading"}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.startAction}>
        <AppButton
          title="Check for Scam"
          onPress={handleSubmit}
          disabled={!canSubmit}
        />
      </View>

      {status === "loading" && <BodyText>Checking...</BodyText>}
      {status === "error" && (
        <BodyText style={styles.errorText}>Error: {error}</BodyText>
      )}
      {status === "success" && result && (
        <View
          style={[
            styles.result,
            { borderLeftColor: verdictCopy[result.verdict].color },
          ]}
        >
          <HeadingText style={styles.resultTitle}>
            {verdictCopy[result.verdict].label}
          </HeadingText>
          <BodyText style={styles.resultMeta}>
            {Math.round(result.confidence * 100)}% confident
          </BodyText>
          <BodyText>{result.explanation}</BodyText>
          <View style={styles.startAction}>
            <AppButton title="Check Another" onPress={handleReset} />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  intro: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: fontSize.title,
  },
  subtitle: {
    color: colors.secondary,
  },
  startAction: {
    alignSelf: "flex-start",
  },
  textInput: {
    minHeight: 140,
    textAlignVertical: "top",
    fontSize: fontSize.body,
    color: colors.text,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius,
    padding: spacing.md,
  },
  imageSection: {
    gap: spacing.sm,
  },
  imageList: {
    gap: spacing.sm,
  },
  imageItem: {
    alignItems: "center",
    gap: spacing.sm,
  },
  thumbnail: {
    width: 140,
    height: 140,
    borderRadius: radius,
  },
  result: {
    gap: spacing.sm,
    paddingLeft: spacing.md,
    borderLeftWidth: 4,
  },
  resultTitle: {
    fontSize: fontSize.title,
  },
  resultMeta: {
    fontSize: fontSize.caption,
    color: colors.secondary,
  },
  errorText: {
    color: colors.danger,
  },
});
