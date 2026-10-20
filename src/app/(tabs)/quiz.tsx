import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { BodyText } from "@/components/body-text";
import { HeadingText } from "@/components/heading-text";
import { colors, fontSize, radius, spacing } from "@/constants/theme";
import {
  callAI,
  parseJsonReply,
  UNEXPECTED_REPLY_MESSAGE,
} from "@/services/ai";
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

const QUIZ_ITEM_SYSTEM = `You write practice items for a "Spot the Scam" quiz that teaches older adults to recognize scams, including AI-powered ones (cloned voices, deepfakes, AI-written phishing).
Write one realistic short message (1-3 sentences). The user says what kind of message it is and whether it must be a scam or legitimate. Make legitimate messages realistic too, not obviously safe.
Then explain in one or two short, plain sentences, with no jargon, which signs show it is or isn't a scam. The reader already knows the answer, so don't restate it; only describe the signs.
Reply with only JSON, no other text:
{"text": string, "explanation": string}`;

// Picked in code so the 5 calls don't all return the same kind of message.
const QUIZ_SCENARIOS = [
  "text message from a bank",
  "voicemail transcript from a grandchild",
  "email about a package delivery",
  "phone call transcript from a government agency",
  "social media message from a friend",
  "email about a computer or account problem",
  "text message about a prize or refund",
] as const;

type QuizScenario = (typeof QUIZ_SCENARIOS)[number];

function selectQuizScenarios(): QuizScenario[] {
  const scenarios = [...QUIZ_SCENARIOS];
  for (let i = scenarios.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scenarios[i], scenarios[j]] = [scenarios[j], scenarios[i]];
  }
  return scenarios.slice(0, QUIZ_LENGTH);
}

let nextQuizItemId = 0;

// Text items only for now. TODO: image items from a hand-made set.
async function generateQuizItem(scenario: QuizScenario): Promise<QuizItem> {
  // Decided here, not by the model: models can't pick 50/50 reliably.
  const isScam = Math.random() < 0.5;

  let reply: string;
  try {
    reply = await callAI({
      system: QUIZ_ITEM_SYSTEM,
      prompt: `Write a ${isScam ? "scam" : "legitimate"} ${scenario}.`,
    });
  } catch (caught) {
    // Network/model failures carry technical messages; show a plain one.
    console.warn("generateQuizItem: callAI failed", caught);
    throw new Error("Couldn't load the quiz. Please try again.");
  }

  const { text, explanation } = parseJsonReply(reply);
  // Blank strings would render an empty question or explanation.
  if (
    typeof text !== "string" ||
    !text.trim() ||
    typeof explanation !== "string" ||
    !explanation.trim()
  ) {
    throw new Error(UNEXPECTED_REPLY_MESSAGE);
  }
  return {
    id: String(nextQuizItemId++),
    content: { type: "text", text },
    isScam,
    explanation,
  };
}

// Route: /quiz — true/false game where the player guesses whether each
// piece of content is a scam.
export default function Quiz() {
  const [state, setState] = useState<QuizState>(initialState);
  const latestRun = useRef(0);

  const createQuiz = useCallback(async () => {
    const run = ++latestRun.current;
    setState(initialState);

    try {
      // Assign distinct scenarios before making the independent requests.
      const items = await Promise.all(
        selectQuizScenarios().map((scenario) => generateQuizItem(scenario))
      );
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

  const answer = useCallback((guessIsScam: boolean) => {
    setState((prev) => {
      // Guard against a stray tap landing while there's no active question
      // (e.g. a delayed press after "Next" was already pressed).
      if (prev.status !== "asking") {
        return prev;
      }

      const correct = guessIsScam === prev.items[prev.index].isScam;
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
        <HeadingText style={styles.title}>Spot the Scam</HeadingText>
        <BodyText style={styles.subtitle}>
          Read each message and decide if it's a scam.
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
              <AppButton title="Scam" onPress={() => answer(true)} />
              <AppButton
                title="Not a Scam"
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
                This was {current.isScam ? "a scam" : "not a scam"}.
              </BodyText>
              <BodyText>{current.explanation}</BodyText>
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
