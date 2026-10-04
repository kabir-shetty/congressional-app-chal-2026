import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { BodyText } from "@/components/body-text";
import { HeadingText } from "@/components/heading-text";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
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

  // Only meaningful once a question has actually been loaded — "Question 0"
  // before the player starts would be noise, not information.
  const questionNumber = totalAnswered + (current ? 1 : 0);

  return (
    <View style={styles.container}>
      {status === "idle" && (
        <View style={styles.block}>
          <BodyText>
            Look at each one and guess whether it was made by a person or by AI.
          </BodyText>
          <View style={styles.startAction}>
            <AppButton title="Start Quiz" onPress={loadNext} />
          </View>
        </View>
      )}

      {status === "loading" && <BodyText>Loading question...</BodyText>}

      {status === "error" && (
        <View style={styles.block}>
          <BodyText style={styles.errorText}>Error: {error}</BodyText>
          <AppButton title="Try Again" onPress={loadNext} />
        </View>
      )}

      {(status === "ready" || status === "answered") && current && (
        <View style={styles.block}>
          <View style={styles.meta}>
            <HeadingText style={styles.questionNumber}>
              Question {questionNumber}
            </HeadingText>
            <BodyText style={styles.scoreCaption}>
              {score} right so far
            </BodyText>
          </View>

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
            <View
              style={[
                styles.resultBlock,
                lastAnswerCorrect ? styles.resultCorrect : styles.resultIncorrect,
              ]}
            >
              <BodyText
                style={lastAnswerCorrect ? styles.correctText : styles.incorrectText}
              >
                {lastAnswerCorrect ? "Correct." : "Not quite."}
              </BodyText>
              <BodyText>
                This was{" "}
                {current.isAiGenerated ? "AI-generated" : "not AI-generated"}.
              </BodyText>
              <View style={styles.startAction}>
                <AppButton title="Next Question" onPress={loadNext} />
              </View>
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
    backgroundColor: colors.background,
  },
  block: {
    gap: spacing.md,
  },
  startAction: {
    alignSelf: "flex-start",
  },
  meta: {
    gap: 2,
  },
  questionNumber: {
    fontSize: fontSize.title,
  },
  scoreCaption: {
    fontSize: fontSize.caption,
    color: colors.secondary,
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
  resultBlock: {
    gap: spacing.sm,
    paddingLeft: spacing.md,
    borderLeftWidth: 4,
  },
  resultCorrect: {
    borderLeftColor: colors.success,
  },
  resultIncorrect: {
    borderLeftColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
  },
  correctText: {
    fontWeight: "700",
    color: colors.success,
  },
  incorrectText: {
    fontWeight: "700",
    color: colors.danger,
  },
});
