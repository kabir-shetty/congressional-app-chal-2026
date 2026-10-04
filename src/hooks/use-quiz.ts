import { useCallback, useState } from "react";

import { generateQuizItem } from "@/services/quiz-service";
import type { QuizItem } from "@/types/quiz";

// idle: nothing loaded yet. loading: fetching a question. ready: question
// shown, waiting for a guess. answered: guess made, waiting for "Next".
// error: generateQuizItem() failed.
type QuizStatus = "idle" | "loading" | "ready" | "answered" | "error";

type UseQuizState = {
  status: QuizStatus;
  current: QuizItem | null;
  error: string | null;
  score: number;
  totalAnswered: number;
  lastAnswerCorrect: boolean | null;
};

const initialState: UseQuizState = {
  status: "idle",
  current: null,
  error: null,
  score: 0,
  totalAnswered: 0,
  lastAnswerCorrect: null,
};

// Drives the true/false "is this AI?" quiz: fetching questions and scoring
// answers, so the screen only has to render whatever state comes back.
export function useQuiz() {
  const [state, setState] = useState<UseQuizState>(initialState);

  const loadNext = useCallback(async () => {
    // Keep score/totalAnswered across questions; only the per-question
    // fields reset here.
    setState((prev) => ({
      ...prev,
      status: "loading",
      current: null,
      error: null,
      lastAnswerCorrect: null,
    }));

    try {
      const item = await generateQuizItem();
      setState((prev) => ({ ...prev, status: "ready", current: item }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Something went wrong.",
      }));
    }
  }, []);

  const answer = useCallback((guessIsAi: boolean) => {
    setState((prev) => {
      // Guard against a stray tap landing while there's no active question
      // (e.g. a delayed press after "Next" was already pressed).
      if (prev.status !== "ready" || !prev.current) {
        return prev;
      }

      const correct = guessIsAi === prev.current.isAiGenerated;
      return {
        ...prev,
        status: "answered",
        lastAnswerCorrect: correct,
        score: prev.score + (correct ? 1 : 0),
        totalAnswered: prev.totalAnswered + 1,
      };
    });
  }, []);

  const resetScore = useCallback(() => {
    setState(initialState);
  }, []);

  return { ...state, loadNext, answer, resetScore };
}
