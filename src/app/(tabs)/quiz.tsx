import { Image } from "expo-image";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, StyleSheet, View } from "react-native";

import { AppText } from "@/components/app-text";
import { LeafCard } from "@/components/leaf-card";
import { FadeIn, PulseDots } from "@/components/motion";
import { PillButton } from "@/components/pill-button";
import { Screen } from "@/components/screen";
import { ScreenHeader } from "@/components/screen-header";
import {
  callAI,
  parseJsonReply,
  UNEXPECTED_REPLY_MESSAGE,
} from "@/services/ai";
import { makeStyles, useColors } from "@/theme/colors";
import { pill } from "@/theme/shape";
import type { QuizItem } from "@/types/quiz";

const QUIZ_LENGTH = 5;

// preparing: building items. asking: question shown, waiting for a guess.
// answered: guess made, waiting for "Next". finished: all answered.
// error: createQuiz() failed.
type QuizStatus = "preparing" | "asking" | "answered" | "finished" | "error";

type QuizState = {
  status: QuizStatus;
  items: QuizItem[];
  index: number;
  error: string | null;
  score: number;
  // One entry per answered question, in order; drives the progress pills.
  results: boolean[];
  lastAnswerCorrect: boolean | null;
};

const initialState: QuizState = {
  status: "preparing",
  items: [],
  index: 0,
  error: null,
  score: 0,
  results: [],
  lastAnswerCorrect: null,
};

const QUIZ_ITEM_SYSTEM = `You write practice items for a "Spot the Scam" quiz that teaches older adults to recognize scams, including AI-powered ones (cloned voices, deepfakes, AI-written phishing).
Write one realistic short message (1-3 sentences). The user says what kind of message it is and whether it must be a scam or legitimate. Make legitimate messages realistic too, not obviously safe.
Also give the sender as it would appear on a phone: a name, organization, or phone number (e.g. "Dr. Patel's Office", "+1 (844) 555-0192"). Use 555 numbers and made-up names only.
Then explain in one or two short, plain sentences, with no jargon, which signs show it is or isn't a scam. The reader already knows the answer, so don't restate it; only describe the signs.
Reply with only JSON, no other text:
{"from": string, "text": string, "explanation": string}`;

// Picked in code so the 5 calls don't all return the same kind of message.
// `kind` is shown in the message card header.
const QUIZ_SCENARIOS = [
  { kind: "Text message", about: "from a bank" },
  { kind: "Voicemail", about: "from a grandchild" },
  { kind: "Email", about: "about a package delivery" },
  { kind: "Phone call", about: "from a government agency" },
  { kind: "Social media message", about: "from a friend" },
  { kind: "Email", about: "about a computer or account problem" },
  { kind: "Text message", about: "about a prize or refund" },
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
      prompt: `Write a ${isScam ? "scam" : "legitimate"} ${scenario.kind.toLowerCase()} ${scenario.about}.`,
    });
  } catch (caught) {
    // Network/model failures carry technical messages; show a plain one.
    console.warn("generateQuizItem: callAI failed", caught);
    throw new Error("Check that you're online, then tap Try again.");
  }

  const { from, text, explanation } = parseJsonReply(reply);
  // Blank strings would render an empty card or explanation.
  if (
    typeof from !== "string" ||
    !from.trim() ||
    typeof text !== "string" ||
    !text.trim() ||
    typeof explanation !== "string" ||
    !explanation.trim()
  ) {
    throw new Error(UNEXPECTED_REPLY_MESSAGE);
  }
  return {
    id: String(nextQuizItemId++),
    kind: scenario.kind,
    from,
    content: { type: "text", text },
    isScam,
    explanation,
  };
}

function scoreLine(score: number) {
  if (score === QUIZ_LENGTH) {
    return "You caught every one. Those signs will help you when a real one arrives.";
  }
  if (score >= 3) {
    return "Nicely done. Each round makes the signs easier to see.";
  }
  return "Scams are built to fool people. Each round you practice makes the next one easier to spot.";
}

// Route: /quiz — guess whether each message is a scam, then see the sign
// that gives it away.
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
      setState({ ...initialState, status: "asking", items });
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
        results: [...prev.results, correct],
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

  const { status, items, index, error, score, results, lastAnswerCorrect } =
    state;

  // Feedback renders below the message; announce it so screen reader users
  // (iOS has no live regions) hear the result right away.
  useEffect(() => {
    if (status === "answered") {
      AccessibilityInfo.announceForAccessibility(
        lastAnswerCorrect ? "You got it." : "Not quite."
      );
    }
  }, [status, lastAnswerCorrect]);

  const current =
    status === "asking" || status === "answered" ? items[index] : null;
  const isLastQuestion = index === items.length - 1;

  return (
    // Reset scroll per question/phase, not on a guess: feedback renders
    // where the answer buttons were.
    <Screen scrollKey={current ? index : status}>
      {status === "preparing" && (
        <>
          <ScreenHeader title="Spot the Scam" />
          <View style={layout.waiting} accessibilityLiveRegion="polite">
            <PulseDots color={colors.quiz} />
            <AppText tone="muted" style={layout.center}>
              Getting your practice messages ready…
            </AppText>
          </View>
        </>
      )}

      {status === "error" && error && (
        <FadeIn style={layout.stage}>
          <ScreenHeader title="Spot the Scam" />
          <LeafCard border="line" style={layout.feedback}>
            <AppText variant="feedbackTitle">That didn&apos;t work.</AppText>
            <AppText variant="bodyStrong">{error}</AppText>
          </LeafCard>
          <PillButton title="Try again" variant="quiz" onPress={createQuiz} />
        </FadeIn>
      )}

      {current && (
        <View style={layout.stage}>
          <View style={layout.header}>
            <AppText variant="title" accessibilityRole="header">
              Spot the Scam
            </AppText>
            <View style={layout.progressRow}>
              <AppText variant="callout" tone="muted">
                Message {index + 1} of {items.length}
              </AppText>
              <View
                style={layout.pills}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                {items.map((item, i) => (
                  <View
                    key={item.id}
                    style={[
                      styles.pill,
                      results[i] === true && styles.pillRight,
                      results[i] === false && styles.pillWrong,
                      results[i] === undefined &&
                        i === index &&
                        styles.pillCurrent,
                    ]}
                  />
                ))}
              </View>
            </View>
          </View>

          <LeafCard border="line" style={layout.message}>
            <View style={styles.messageHeader}>
              <AppText variant="small" tone="muted">
                {current.kind}
              </AppText>
              <AppText variant="calloutStrong">{current.from}</AppText>
            </View>
            {current.content.type === "text" ? (
              <AppText style={layout.messageBody}>{current.content.text}</AppText>
            ) : (
              <Image
                source={{ uri: current.content.uri }}
                style={{
                  width: "100%",
                  aspectRatio: current.content.width / current.content.height,
                }}
              />
            )}
          </LeafCard>

          {status === "asking" && (
            <View style={layout.answers}>
              <PillButton
                title="It's a scam"
                variant="quiz"
                size="large"
                onPress={() => answer(true)}
              />
              <PillButton
                title="It's not a scam"
                variant="quizOutline"
                size="large"
                onPress={() => answer(false)}
              />
            </View>
          )}

          {status === "answered" && (
            <FadeIn style={layout.answered}>
              <LeafCard
                fill={lastAnswerCorrect ? "safeTint" : "scamTint"}
                style={layout.feedback}
              >
                <AppText
                  variant="feedbackTitle"
                  tone={lastAnswerCorrect ? "safeInk" : "scamInk"}
                  accessibilityRole="header"
                >
                  {lastAnswerCorrect ? "You got it." : "Not quite."}
                </AppText>
                <AppText variant="bodyStrong">
                  {current.isScam
                    ? "This one is a scam."
                    : "This one is not a scam."}
                </AppText>
              </LeafCard>
              <AppText variant="subheading" accessibilityRole="header">
                The sign to remember
              </AppText>
              <AppText>{current.explanation}</AppText>
              <PillButton
                title={isLastQuestion ? "See my score" : "Next message"}
                variant="quiz"
                onPress={next}
              />
            </FadeIn>
          )}
        </View>
      )}

      {status === "finished" && (
        <FadeIn style={layout.finished}>
          <AppText variant="title" accessibilityRole="header">
            Spot the Scam
          </AppText>
          <LeafCard border="line" style={layout.score}>
            <AppText variant="callout" tone="muted">
              Your score
            </AppText>
            <AppText variant="display" tone="quiz">
              {score} of {items.length}
            </AppText>
            <AppText style={layout.scoreLine}>{scoreLine(score)}</AppText>
          </LeafCard>
          <View style={layout.answers}>
            <PillButton title="Try again" variant="quiz" onPress={createQuiz} />
            <PillButton
              title="Read about AI Scams"
              variant="quizGhost"
              size="small"
              onPress={() => router.navigate("/ai-scams")}
            />
          </View>
        </FadeIn>
      )}
    </Screen>
  );
}

const layout = StyleSheet.create({
  stage: { gap: 18 },
  header: { gap: 12 },
  progressRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  pills: {
    flexDirection: "row",
    gap: 6,
  },
  waiting: {
    minHeight: 360,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  center: { textAlign: "center" },
  message: { overflow: "hidden" },
  messageBody: { padding: 18 },
  answers: { gap: 12 },
  answered: { gap: 14 },
  feedback: {
    padding: 18,
    gap: 8,
  },
  finished: {
    gap: 22,
    paddingTop: 20,
  },
  score: {
    paddingVertical: 28,
    paddingHorizontal: 22,
    gap: 10,
    alignItems: "flex-start",
  },
  scoreLine: { marginTop: 6 },
});

const useStyles = makeStyles((c) => ({
  pill: {
    width: 16,
    height: 10,
    borderRadius: pill,
    borderWidth: 2,
    borderColor: c.lineStrong,
  },
  pillRight: {
    backgroundColor: c.safeInk,
    borderColor: c.safeInk,
  },
  pillWrong: {
    backgroundColor: c.scamInk,
    borderColor: c.scamInk,
  },
  pillCurrent: {
    borderColor: c.accent,
  },
  messageHeader: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    gap: 2,
    backgroundColor: c.soft,
  },
}));
