import { useCallback, useRef, useState } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";

/** What a submit handler gives back: a text is shown as the error; nothing means it worked. */
export type SubmitResult = string | null | undefined | void;

/**
 * Runs the submit handler of a template, keeps `busy` while it works and turns its answer into
 * an `error` text. A handler that throws shows a generic message instead of breaking the page.
 */
export function useSubmit<T>(
  onSubmit: ((values: T) => SubmitResult | Promise<SubmitResult>) | undefined,
) {
  const { t } = useLostTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const running = useRef(false);

  const run = useCallback(
    async (values: T): Promise<boolean> => {
      if (running.current) return false;
      running.current = true;
      setBusy(true);
      setError(null);
      try {
        const result = await onSubmit?.(values);
        if (typeof result === "string" && result !== "") {
          setError(result);
          return false;
        }
        return true;
      } catch {
        setError(t("auth.errorFallback"));
        return false;
      } finally {
        running.current = false;
        setBusy(false);
      }
    },
    [onSubmit, t],
  );

  return { busy, error, run, clearError: () => setError(null) };
}
