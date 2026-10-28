import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type ComponentProps,
  type FormEvent,
  type Ref,
} from "react";

import { FormContext, type FormChild, type FormContextValue } from "../lib/form-context";
import { isThenable } from "../lib/validation";

export type FormHandle = {
  validate: (shouldFocus?: boolean) => Promise<boolean>;
  resetValidation: () => void;
  submit: (event?: FormEvent<HTMLFormElement>) => void;
  reset: (event?: FormEvent<HTMLFormElement>) => void;
  focus: () => void;
  getValidationComponents: () => FormChild[];
};

export type FormProps = Omit<ComponentProps<"form">, "onSubmit" | "onReset" | "ref"> & {
  autofocus?: boolean;
  noErrorFocus?: boolean;
  noResetFocus?: boolean;
  greedy?: boolean;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onReset?: (event?: FormEvent<HTMLFormElement>) => void;
  onValidationSuccess?: () => void;
  onValidationError?: (child: FormChild) => void;
  ref?: Ref<FormHandle>;
};

type ChildResult = { valid: boolean; child: FormChild; err?: unknown };

function validateChild(child: FormChild): Promise<ChildResult> {
  let outcome: boolean | Promise<boolean>;

  try {
    outcome = child.validate();
  } catch (err) {
    return Promise.resolve({ valid: false, child, err });
  }

  return isThenable(outcome)
    ? Promise.resolve(outcome).then(
        (valid) => ({ valid: Boolean(valid), child }),
        (err: unknown) => ({ valid: false, child, err }),
      )
    : Promise.resolve({ valid: Boolean(outcome), child });
}

const focusable =
  "input:not([type=hidden]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex]:not([tabindex='-1'])";

export function Form({
  autofocus = false,
  noErrorFocus = false,
  noResetFocus = false,
  greedy = false,
  onSubmit,
  onReset,
  onValidationSuccess,
  onValidationError,
  ref,
  children,
  ...rest
}: FormProps) {
  const rootRef = useRef<HTMLFormElement>(null);
  const registered = useRef<FormChild[]>([]);
  const validateIndex = useRef(0);

  const latest = useRef({
    greedy,
    noErrorFocus,
    noResetFocus,
    autofocus,
    onSubmit,
    onReset,
    onValidationSuccess,
    onValidationError,
  });
  latest.current = {
    greedy,
    noErrorFocus,
    noResetFocus,
    autofocus,
    onSubmit,
    onReset,
    onValidationSuccess,
    onValidationError,
  };

  const context = useMemo<FormContextValue>(
    () => ({
      bindChild: (child) => {
        registered.current.push(child);
      },
      unbindChild: (child) => {
        const index = registered.current.indexOf(child);
        if (index !== -1) registered.current.splice(index, 1);
      },
    }),
    [],
  );

  const focus = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const target =
      root.querySelector<HTMLElement>("[autofocus], [data-autofocus]") ??
      root.querySelector<HTMLElement>(focusable);

    target?.focus({ preventScroll: true });
  }, []);

  const validate = useCallback((shouldFocus?: boolean): Promise<boolean> => {
    const options = latest.current;
    const localFocus = typeof shouldFocus === "boolean" ? shouldFocus : !options.noErrorFocus;
    const index = ++validateIndex.current;
    const children = [...registered.current];

    const failures: Promise<ChildResult[]> = options.greedy
      ? Promise.all(children.map(validateChild)).then((all) => all.filter((item) => !item.valid))
      : children
          .reduce<Promise<void>>(
            (chain, child) =>
              chain
                .then(() => validateChild(child))
                .then((result) => {
                  if (!result.valid) throw result;
                }),
            Promise.resolve(),
          )
          .then(() => [] as ChildResult[])
          .catch((result: ChildResult) => [result]);

    return failures.then((errors) => {
      if (errors.length === 0) {
        if (index === validateIndex.current) latest.current.onValidationSuccess?.();
        return true;
      }

      if (index === validateIndex.current) {
        const [first] = errors;
        if (first?.err !== undefined) console.error(first.err);
        if (first) latest.current.onValidationError?.(first.child);

        if (localFocus) {
          errors.find((item) => typeof item.child.focus === "function")?.child.focus?.();
        }
      }

      return false;
    });
  }, []);

  const resetValidation = useCallback(() => {
    validateIndex.current++;
    registered.current.forEach((child) => child.resetValidation());
  }, []);

  const submit = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      const form = event?.currentTarget;
      const index = validateIndex.current + 1;

      void validate().then((valid) => {
        if (index !== validateIndex.current || !valid) return;

        if (latest.current.onSubmit && event) {
          latest.current.onSubmit(event);
        } else if (form && typeof form.submit === "function") {
          form.submit();
        }
      });
    },
    [validate],
  );

  const reset = useCallback(
    (event?: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();
      latest.current.onReset?.(event);

      setTimeout(() => {
        resetValidation();
        if (latest.current.autofocus && !latest.current.noResetFocus) focus();
      }, 0);
    },
    [focus, resetValidation],
  );

  useImperativeHandle(
    ref,
    () => ({
      validate,
      resetValidation,
      submit,
      reset,
      focus,
      getValidationComponents: () => [...registered.current],
    }),
    [validate, resetValidation, submit, reset, focus],
  );

  useEffect(() => {
    if (autofocus) focus();
  }, [autofocus, focus]);

  return (
    <FormContext.Provider value={context}>
      <form ref={rootRef} data-slot="form" noValidate onSubmit={submit} onReset={reset} {...rest}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
