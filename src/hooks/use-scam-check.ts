import type { ScamCheckInput, ScamCheckResult } from "@/types/scam-check";
import { useCallback, useState } from "react";

type ScamCheckStatus = "idle" | "loading" | "success" | "error";

type UseScamCheckState = {
  status: ScamCheckStatus;
  result: ScamCheckResult | null;
  error: string | null;
};

const initialState: UseScamCheckState = {
  status: "idle",
  result: null,
  error: null,
};

// Wraps checkForScam() with loading/success/error state so screens don't
// have to manage that themselves.
export function useScamCheck() {
  const [state, setState] = useState<UseScamCheckState>(initialState);

  const submit = useCallback(async (input: ScamCheckInput) => {
    setState({ status: "loading", result: null, error: null });

    try {
      const result = await checkForScam(input);
      setState({ status: "success", result, error: null });
    } catch (error) {
      // checkForScam throws plain Errors today; the instanceof check is just
      // a safe fallback in case that ever changes.
      setState({
        status: "error",
        result: null,
        error: error instanceof Error ? error.message : "Something went wrong.",
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return { ...state, submit, reset };
}

async function checkForScam(
  _input: ScamCheckInput
): Promise<ScamCheckResult> {
  /*
  Pseudo code (I don't want to actually do it rn)

  if input just text:
    send to ai to check if scam
  if input just image:
    send to ai to read text from image
    give error message if this fails
    send text to ai to check if scam
  if both:
    idk, maybe just make user select between them
    or maybe interpret text as explanation what happened in that case.
  */

  // example result
  return {
    verdict: "likely_scam",
    confidence: 0.7,
    explanation: "You'll be fine."
  }
}
