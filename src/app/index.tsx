import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useScamCheck } from "@/hooks/use-scam-check";
import type { ScamCheckImage } from "@/types/scam-check";

export default function Index() {
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
      <Text>Paste the message or describe what happened</Text>
      <TextInput
        style={styles.textInput}
        multiline
        value={text}
        onChangeText={setText}
        placeholder="e.g. a text, email, or DM you received"
        editable={status !== "loading"}
      />

      <View style={styles.imageSection}>
        <Button
          title="Add Screenshot"
          onPress={pickImage}
          disabled={status === "loading"}
        />

        {images.length > 0 && (
          <ScrollView horizontal style={styles.imageList}>
            {images.map((image) => (
              <View key={image.uri} style={styles.imageItem}>
                <Image source={{ uri: image.uri }} style={styles.thumbnail} />
                <Button
                  title="Remove"
                  onPress={() => removeImage(image.uri)}
                  disabled={status === "loading"}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <Button
        title="Check for Scam"
        onPress={handleSubmit}
        disabled={!canSubmit}
      />

      {status === "loading" && <Text>Checking...</Text>}
      {status === "error" && <Text>Error: {error}</Text>}
      {status === "success" && result && (
        <View style={styles.result}>
          <Text>Verdict: {result.verdict}</Text>
          <Text>Confidence: {result.confidence}</Text>
          <Text>{result.explanation}</Text>
          <Button title="Check Another" onPress={handleReset} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    gap: 12,
  },
  textInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  imageSection: {
    gap: 8,
  },
  imageList: {
    flexDirection: "row",
  },
  imageItem: {
    marginRight: 8,
    alignItems: "center",
  },
  thumbnail: {
    width: 100,
    height: 100,
  },
  result: {
    gap: 4,
  },
});
