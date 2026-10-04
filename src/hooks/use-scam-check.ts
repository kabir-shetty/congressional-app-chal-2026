import { useCallback, useState } from "react";

import { checkForScam } from "@/services/scam-check-service";
import type { ScamCheckInput, ScamCheckResult } from "@/types/scam-check";

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
