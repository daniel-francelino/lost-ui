import { useCallback, useEffect, useRef, useState } from "react";

import { useFormChild } from "./form-context";
import { runRules, type LazyRules, type ValidationRule } from "./validation";

export type FieldValidationOptions<T> = {
  value: T;
  rules?: ValidationRule<T>[];
  lazyRules?: LazyRules;
  reactiveRules?: boolean;
  error?: boolean | null;
  errorMessage?: string;
  disabled?: boolean;
  name?: string;
  focus?: () => void;
};

export type FieldValidation<T> = {
  hasError: boolean;
  errorMessage: string | null;
  loading: boolean;
  isDirty: boolean;
  validate: (value?: T) => boolean | Promise<boolean>;
  resetValidation: () => void;
  onFocus: () => void;
  onBlur: () => void;
};

export function useFieldValidation<T>({
  value,
  rules,
  lazyRules = false,
  reactiveRules = false,
  error,
  errorMessage,
  disabled = false,
  name,
  focus,
}: FieldValidationOptions<T>): FieldValidation<T> {
  const [innerError, setInnerError] = useState(false);
  const [innerMessage, setInnerMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const live = useRef({
    value,
    rules,
    lazyRules,
    disabled,
    loading: false,
    innerError: false,
    isDirty: false,
  });
  live.current.value = value;
  live.current.rules = rules;
  live.current.lazyRules = lazyRules;
  live.current.disabled = disabled;

  const validateIndex = useRef(0);
  const unmounted = useRef(false);
  const pendingBlur = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const setDirty = useCallback((next: boolean) => {
    live.current.isDirty = next;
    setIsDirty(next);
  }, []);

  const setBusy = useCallback((next: boolean) => {
    live.current.loading = next;
    setLoading(next);
  }, []);

  const setFailure = useCallback((failed: boolean, message: string | null) => {
    live.current.innerError = failed;
    setInnerError(failed);
    setInnerMessage(message);
  }, []);

  const hasRules = useCallback(() => (live.current.rules?.length ?? 0) > 0, []);

  const canDebounce = useCallback(
    () => !live.current.disabled && hasRules() && !live.current.loading,
    [hasRules],
  );

  const validateRef = useRef<(next?: T) => boolean | Promise<boolean>>(() => true);

  const schedule = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      void validateRef.current();
    }, 0);
  }, []);

  const validate = useCallback(
    (next?: T): boolean | Promise<boolean> => {
      const current = live.current;
      const activeRules = current.rules;
      if (current.disabled || !activeRules || activeRules.length === 0) return true;

      const index = ++validateIndex.current;
      const startValue = current.value;
      const wasBusy = current.loading;
      pendingBlur.current = false;

      const revalidateIfStale = () => {
        const blurArrived = pendingBlur.current;
        pendingBlur.current = false;
        const now = live.current;

        if (
          !unmounted.current &&
          !Object.is(now.value, startValue) &&
          canDebounce() &&
          now.lazyRules !== "ondemand" &&
          (now.lazyRules === false || now.innerError || blurArrived)
        ) {
          schedule();
        }
      };

      const update = (failed: boolean, message?: string | null) => {
        if (failed && !wasBusy) setDirty(true);
        setFailure(failed, message ?? null);
        setBusy(false);
      };

      const outcome = runRules(activeRules, next === undefined ? current.value : next);

      if (outcome.kind === "failed") {
        update(true, outcome.message);
        return false;
      }

      if (outcome.kind === "passed") {
        update(false);
        return true;
      }

      setBusy(true);

      return Promise.all(outcome.promises).then(
        (results) => {
          const failure = results.find((item) => item === false || typeof item === "string");
          if (index === validateIndex.current) {
            update(failure !== undefined, typeof failure === "string" ? failure : null);
            revalidateIfStale();
          }
          return failure === undefined;
        },
        (reason: unknown) => {
          if (index === validateIndex.current) {
            console.error(reason);
            update(true);
            revalidateIfStale();
          }
          return false;
        },
      );
    },
    [canDebounce, schedule, setBusy, setDirty, setFailure],
  );
  validateRef.current = validate;

  const resetValidation = useCallback(() => {
    validateIndex.current++;
    setBusy(false);
    setDirty(false);
    setFailure(false, null);
    pendingBlur.current = false;
    clearTimeout(timer.current);
  }, [setBusy, setDirty, setFailure]);

  const previousValue = useRef(value);
  useEffect(() => {
    if (Object.is(previousValue.current, value)) return;
    previousValue.current = value;
    setDirty(true);

    const now = live.current;
    if (canDebounce() && (now.lazyRules === false || (now.lazyRules === true && now.innerError))) {
      schedule();
    }
  }, [value, canDebounce, schedule, setDirty]);

  const onRulesChange = useCallback(() => {
    if (live.current.lazyRules !== "ondemand" && canDebounce() && live.current.isDirty) {
      schedule();
    }
  }, [canDebounce, schedule]);

  const previousLazy = useRef(lazyRules);
  useEffect(() => {
    if (previousLazy.current === lazyRules) return;
    previousLazy.current = lazyRules;
    onRulesChange();
  }, [lazyRules, onRulesChange]);

  const previousRules = useRef(rules);
  useEffect(() => {
    if (previousRules.current === rules) return;
    previousRules.current = rules;
    if (reactiveRules) onRulesChange();
  }, [rules, reactiveRules, onRulesChange]);

  useEffect(() => {
    unmounted.current = false;
    return () => {
      unmounted.current = true;
      clearTimeout(timer.current);
    };
  }, []);

  const onFocus = useCallback(() => {
    setDirty(true);
  }, [setDirty]);

  const onBlur = useCallback(() => {
    const now = live.current;
    if (now.lazyRules === "ondemand") return;

    if (canDebounce()) {
      schedule();
    } else if (!now.disabled && hasRules() && now.loading) {
      pendingBlur.current = true;
    }
  }, [canDebounce, hasRules, schedule]);

  useFormChild({
    validate: () => validate(),
    resetValidation,
    ...(focus ? { focus } : {}),
    ...(name ? { name } : {}),
  });

  return {
    hasError: error === true || innerError,
    errorMessage:
      typeof errorMessage === "string" && errorMessage.length > 0 ? errorMessage : innerMessage,
    loading,
    isDirty,
    validate,
    resetValidation,
    onFocus,
    onBlur,
  };
}
