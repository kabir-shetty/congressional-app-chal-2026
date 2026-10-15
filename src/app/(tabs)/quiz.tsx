import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { BodyText } from "@/components/body-text";
import { HeadingText } from "@/components/heading-text";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import type { QuizItem } from "@/types/quiz";

const QUIZ_LENGTH = 5;

// preparing: building items. prepared: items ready, waiting for "Start".
// asking: question shown, waiting for a guess. answered: guess made,
// waiting for "Next". finished: all answered. error: createQuiz() failed.
type QuizStatus =
  | "preparing"
  | "prepared"
  | "asking"
  | "answered"
  | "finished"
  | "error";

type QuizState = {
  status: QuizStatus;
  items: QuizItem[];
  index: number;
  error: string | null;
  score: number;
  lastAnswerCorrect: boolean | null;
};

const initialState: QuizState = {
  status: "preparing",
  items: [],
  index: 0,
  error: null,
  score: 0,
  lastAnswerCorrect: null,
};

// Generate a single quiz item. Stub is not implemented yet.
async function generateQuizItem(): Promise<QuizItem> {
  throw new Error("generateQuizItem is not implemented yet.");
}

// Route: /quiz — true/false game where the player guesses whether each
// piece of content was AI-generated.
export default function Quiz() {
  const [state, setState] = useState<QuizState>(initialState);
  const latestRun = useRef(0);

  const createQuiz = useCallback(async () => {
    const run = ++latestRun.current;
    setState(initialState);

    try {
      // Generate questions one at a time. If any fails, the whole quiz fails
      // and "Try Again" rebuilds from scratch. TODO: if generateQuizItem
      // calls are independent, use Promise.all (~5× faster); keep sequential
      // only for rate limits or dedup, and say so here.
      const items: QuizItem[] = [];
      for (let i = 0; i < QUIZ_LENGTH; i++) {
        const item = await generateQuizItem();
        items.push(item);
      }
      // A newer run (double tap, StrictMode re-mount) or an unmount
      // superseded this one — applying it would wipe the player's progress.
      if (run !== latestRun.current) {
        return;
      }
      setState({ ...initialState, status: "prepared", items });
    } catch (error) {
      if (run !== latestRun.current) {
        return;
      }
      setState({
        ...initialState,
        status: "error",
        error: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }, []);

  const start = useCallback(() => {
    setState((prev) =>
      prev.status === "prepared" ? { ...prev, status: "asking" } : prev
    );
  }, []);

  const answer = useCallback((guessIsAi: boolean) => {
    setState((prev) => {
      // Guard against a stray tap landing while there's no active question
      // (e.g. a delayed press after "Next" was already pressed).
      if (prev.status !== "asking") {
        return prev;
      }

      const correct = guessIsAi === prev.items[prev.index].isAiGenerated;
      return {
        ...prev,
        status: "answered",
        lastAnswerCorrect: correct,
        score: prev.score + (correct ? 1 : 0),
      };
    });
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      if (prev.status !== "answered") {
        return prev;
      }

      const index = prev.index + 1;
      return index < prev.items.length
        ? { ...prev, status: "asking", index, lastAnswerCorrect: null }
        : { ...prev, status: "finished" };
    });
  }, []);

  // Build the quiz as soon as the page opens and invalidate on unmount so
  // any in-flight createQuiz() result is ignored.
  useEffect(() => {
    createQuiz();
    return () => {
      latestRun.current++;
    };
  }, [createQuiz]);

  const { status, items, index, error, score, lastAnswerCorrect } = state;

  // Only expose the current question once the player has started, so the
  // prepared quiz stays hidden until then.
  const isPlaying = status === "asking" || status === "answered";
  const current = isPlaying ? items[index] : null;
  const questionNumber = index + 1;
  const totalQuestions = items.length;
  const isLastQuestion = index === items.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.intro}>
        <HeadingText style={styles.title}>AI or Not</HeadingText>
        <BodyText style={styles.subtitle}>
          Guess whether each one was made by a person or by AI.
        </BodyText>
      </View>

      {status === "preparing" && <BodyText>Getting your quiz ready...</BodyText>}

      {status === "prepared" && (
        <View style={styles.startAction}>
          <AppButton title="Start Quiz" onPress={start} />
        </View>
      )}

      {status === "error" && (
        <View style={styles.block}>
          <BodyText style={styles.errorText}>Error: {error}</BodyText>
          <View style={styles.startAction}>
            <AppButton title="Try Again" onPress={createQuiz} />
          </View>
        </View>
      )}

      {status === "finished" && (
        <View style={styles.block}>
          <HeadingText style={styles.sectionHeading}>
            You got {score} of {totalQuestions} right.
          </HeadingText>
          <View style={styles.startAction}>
            <AppButton title="Play Again" onPress={createQuiz} />
          </View>
        </View>
      )}

      {current && (
        <View style={styles.block}>
          <View style={styles.meta}>
            <HeadingText style={styles.sectionHeading}>
              Question {questionNumber} of {totalQuestions}
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

          {status === "asking" && (
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
                <AppButton
                  title={isLastQuestion ? "See My Score" : "Next Question"}
                  onPress={next}
                />
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
  block: {
    gap: spacing.md,
  },
  startAction: {
    alignSelf: "flex-start",
  },
  meta: {
    gap: 2,
  },
  sectionHeading: {
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
