import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { Alert, ScrollView, StyleSheet, TextInput, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { BodyText } from "@/components/body-text";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import { useScamCheck } from "@/hooks/use-scam-check";
import type { ScamCheckImage } from "@/types/scam-check";

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
      <BodyText>Paste the message or describe what happened</BodyText>
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
        <AppButton
          title="Add Screenshot"
          onPress={pickImage}
          disabled={status === "loading"}
        />

        {images.length > 0 && (
          <ScrollView horizontal contentContainerStyle={styles.imageList}>
            {images.map((image) => (
              <View key={image.uri} style={styles.imageItem}>
                <Image source={{ uri: image.uri }} style={styles.thumbnail} />
                <AppButton
                  title="Remove"
                  variant="secondary"
                  onPress={() => removeImage(image.uri)}
                  disabled={status === "loading"}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <AppButton
        title="Check for Scam"
        onPress={handleSubmit}
        disabled={!canSubmit}
      />

      {status === "loading" && <BodyText>Checking...</BodyText>}
      {status === "error" && (
        <BodyText style={styles.errorText}>Error: {error}</BodyText>
      )}
      {status === "success" && result && (
        <View style={styles.result}>
          <BodyText>Verdict: {result.verdict}</BodyText>
          <BodyText>Confidence: {result.confidence}</BodyText>
          <BodyText>{result.explanation}</BodyText>
          <AppButton title="Check Another" onPress={handleReset} />
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
    backgroundColor: colors.surface,
    borderRadius: radius,
    padding: spacing.md,
  },
  errorText: {
    color: colors.danger,
  },
});
