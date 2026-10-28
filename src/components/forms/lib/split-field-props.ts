import type { FieldProps } from "./field-props";

const fieldKeys = new Set([
  "id",
  "name",
  "label",
  "description",
  "hint",
  "help",
  "value",
  "defaultValue",
  "onValueChange",
  "rules",
  "lazyRules",
  "reactiveRules",
  "error",
  "errorMessage",
  "disabled",
  "readOnly",
  "required",
  "size",
  "className",
]);

export function splitFieldProps<T, P extends FieldProps<T>>(
  props: P,
): [FieldProps<T>, Omit<P, keyof FieldProps<T>>] {
  const field: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    (fieldKeys.has(key) ? field : rest)[key] = value;
  }

  return [field as FieldProps<T>, rest as Omit<P, keyof FieldProps<T>>];
}

export function composeHandlers<E>(
  first: ((event: E) => void) | undefined,
  second: ((event: E) => void) | undefined,
) {
  return (event: E) => {
    first?.(event);
    second?.(event);
  };
}
