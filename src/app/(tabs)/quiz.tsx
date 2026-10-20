import { Image } from "expo-image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, ActivityIndicator, View } from "react-native";

import { AppButton } from "@/components/app-button";
import { AppText } from "@/components/app-text";
import { Card } from "@/components/card";
import { Inset } from "@/components/inset";
import { InstructionStrip } from "@/components/instruction-strip";
import { Meter } from "@/components/meter";
import { Screen } from "@/components/screen";
import { ScreenIntro } from "@/components/screen-intro";
import { makeStyles, spacing, useColors } from "@/constants/theme";
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
    throw new Error("Check that you're online, then tap Try again.");
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
  const styles = useStyles();
  const colors = useColors();
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

  // Feedback renders below the question; announce it so screen reader
  // users (iOS has no live regions) hear the result right away.
  useEffect(() => {
    if (status === "answered") {
      AccessibilityInfo.announceForAccessibility(
        lastAnswerCorrect ? "Correct." : "Not quite."
      );
    }
  }, [status, lastAnswerCorrect]);

  // Only expose the current question once the player has started, so the
  // prepared quiz stays hidden until then.
  const isPlaying = status === "asking" || status === "answered";
  const current = isPlaying ? items[index] : null;
  const questionNumber = index + 1;
  const totalQuestions = items.length;
  const isLastQuestion = index === items.length - 1;

  return (
    <Screen>
      <ScreenIntro
        title="Can you tell which ones are scams?"
        subtitle="Read each message and decide if it's a scam."
      />

      {status === "preparing" && (
        <Card style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <AppText tone="textMuted">Getting your quiz ready...</AppText>
        </Card>
      )}

      {status === "prepared" && (
        <Card>
          <AppText variant="title" accessibilityRole="header">
            {totalQuestions} practice messages are ready
          </AppText>
          <AppText>
            Some are scams and some aren't. After each guess, you'll see what
            gave it away.
          </AppText>
          <AppButton title="Start quiz" icon="play" onPress={start} fullWidth />
        </Card>
      )}

      {status === "error" && error && (
        <Card>
          <InstructionStrip tone="warning" label="That didn't work" bleed>
            {error}
          </InstructionStrip>
          <AppButton
            title="Try again"
            icon="refresh"
            onPress={createQuiz}
            fullWidth
          />
        </Card>
      )}

      {status === "finished" && (
        <Card>
          <AppText variant="title" accessibilityRole="header">
            You got {score} of {totalQuestions} right.
          </AppText>
          <AppText>
            {score === totalQuestions
              ? "A perfect score. You know what to look for."
              : "Every round makes the warning signs easier to spot."}
          </AppText>
          <AppButton
            title="Play again"
            icon="refresh"
            onPress={createQuiz}
            fullWidth
          />
        </Card>
      )}

      {current && (
        <>
          <Inset style={styles.progress}>
            <View style={styles.progressText}>
              <AppText variant="bodyStrong">
                Question {questionNumber} of {totalQuestions}
              </AppText>
              <AppText variant="callout" tone="textMuted">
                {score} right so far
              </AppText>
            </View>
            <Meter
              value={questionNumber / totalQuestions}
              label="Quiz progress"
            />
          </Inset>

          {/* Every item sits in the same fixed frame so messages compare
              fairly; content is either plain text or an image to inspect. */}
          <Card>
            <AppText variant="bodyStrong">The message</AppText>
            <View style={styles.message}>
              {current.content.type === "text" ? (
                <AppText>{current.content.text}</AppText>
              ) : (
                <Image
                  source={{ uri: current.content.uri }}
                  style={{
                    width: "100%",
                    aspectRatio: current.content.width / current.content.height,
                  }}
                />
              )}
            </View>
          </Card>

          {status === "asking" && (
            <Inset style={styles.answers}>
              <AppButton
                title="It's a scam"
                icon="flag"
                variant="tonal"
                onPress={() => answer(true)}
                fullWidth
              />
              <AppButton
                title="It's not a scam"
                icon="check"
                variant="tonal"
                onPress={() => answer(false)}
                fullWidth
              />
            </Inset>
          )}

          {status === "answered" && (
            <Card>
              <AppText
                variant="title"
                tone={lastAnswerCorrect ? "success" : "danger"}
                accessibilityRole="header"
              >
                {lastAnswerCorrect ? "Correct." : "Not quite."}
              </AppText>
              <InstructionStrip
                bleed
                tone={current.isScam ? "danger" : "success"}
                label={current.isScam ? "This was a scam" : "This was not a scam"}
              >
                {current.explanation}
              </InstructionStrip>
              <AppButton
                title={isLastQuestion ? "See my score" : "Next question"}
                icon="arrow"
                onPress={next}
                fullWidth
              />
            </Card>
          )}
        </>
      )}
    </Screen>
  );
}

const useStyles = makeStyles((c) => ({
  centered: {
    alignItems: "center",
  },
  progress: {
    gap: spacing.sm,
  },
  progressText: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: spacing.sm,
  },
  message: {
    minHeight: 120,
    padding: spacing.md,
    backgroundColor: c.background,
  },
  // Separated more than usual so a shaky tap can't land on the other answer.
  answers: {
    gap: spacing.lg,
  },
}));
