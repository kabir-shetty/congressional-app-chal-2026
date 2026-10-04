import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { BodyText } from "@/components/body-text";
import { colors, radius, spacing } from "@/constants/theme";
import { useQuiz } from "@/hooks/use-quiz";

// Route: /quiz — true/false game where the player guesses whether each
// piece of content was AI-generated.
export default function Quiz() {
  const {
    status,
    current,
    error,
    score,
    totalAnswered,
    lastAnswerCorrect,
    loadNext,
    answer,
  } = useQuiz();

  return (
    <View style={styles.container}>
      <BodyText style={styles.score}>
        Score: {score}/{totalAnswered}
      </BodyText>

      {status === "idle" && <AppButton title="Start Quiz" onPress={loadNext} />}

      {status === "loading" && <BodyText>Loading question...</BodyText>}

      {status === "error" && (
        <View style={styles.block}>
          <BodyText style={styles.errorText}>Error: {error}</BodyText>
          <AppButton title="Try Again" onPress={loadNext} />
        </View>
      )}

      {(status === "ready" || status === "answered") && current && (
        <View style={styles.block}>
          {/* Content is either plain text or an image to inspect. */}
          {current.content.type === "text" ? (
            <BodyText style={styles.content}>{current.content.text}</BodyText>
          ) : (
            <Image
              source={{ uri: current.content.uri }}
              style={{
                width: current.content.width,
                height: current.content.height,
                borderRadius: radius,
              }}
            />
          )}

          {status === "ready" && (
            <View style={styles.answerRow}>
              <AppButton title="AI" onPress={() => answer(true)} />
              <AppButton
                title="Not AI"
                variant="secondary"
                onPress={() => answer(false)}
              />
            </View>
          )}

          {status === "answered" && (
            <View style={styles.block}>
              <BodyText
                style={lastAnswerCorrect ? styles.correctText : styles.incorrectText}
              >
                {lastAnswerCorrect ? "Correct!" : "Incorrect."}
              </BodyText>
              <BodyText>
                This was{" "}
                {current.isAiGenerated ? "AI-generated" : "not AI-generated"}.
              </BodyText>
              <AppButton title="Next Question" onPress={loadNext} />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.lg,
    backgroundColor: "#FFB6C1",
  },
  score: {
    fontWeight: "700",
  },
  block: {
    gap: spacing.md,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: radius,
    padding: spacing.md,
  },
  answerRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  errorText: {
    color: colors.danger,
  },
  correctText: {
    color: colors.success,
    fontWeight: "700",
  },
  incorrectText: {
    color: colors.danger,
    fontWeight: "700",
  },
});
