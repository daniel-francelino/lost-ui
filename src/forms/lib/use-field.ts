import { useId } from "react";

import type { FieldProps } from "./field-props";
import { useControlled } from "./use-controlled";
import { useFieldValidation, type FieldValidation } from "./use-field-validation";

export type FieldIds = {
  id: string;
  labelId: string;
  descriptionId: string;
  helpId: string;
  errorId: string;
};

export type UseFieldOptions<T> = {
  fallback: T;
  focus?: () => void;
};

export type FieldState<T> = {
  value: T;
  setValue: (next: T) => void;
  validation: FieldValidation<T>;
  ids: FieldIds;
  controlProps: {
    id: string;
    "aria-invalid": true | undefined;
    "aria-describedby": string | undefined;
    "aria-required": true | undefined;
    onFocus: () => void;
    onBlur: () => void;
  };
  shellProps: {
    label: FieldProps<T>["label"];
    description: FieldProps<T>["description"];
    hint: FieldProps<T>["hint"];
    help: FieldProps<T>["help"];
    required: boolean | undefined;
    size: FieldProps<T>["size"];
    disabled: boolean | undefined;
    className: string | undefined;
    invalid: boolean;
    errorMessage: string | null;
    ids: FieldIds;
  };
};

export function useField<T>(
  props: FieldProps<T>,
  { fallback, focus }: UseFieldOptions<T>,
): FieldState<T> {
  const generated = useId();
  const id = props.id ?? generated;
  const ids: FieldIds = {
    id,
    labelId: `${id}-label`,
    descriptionId: `${id}-description`,
    helpId: `${id}-help`,
    errorId: `${id}-error`,
  };

  const [stored, setValue] = useControlled<T>({
    ...(props.value !== undefined ? { value: props.value } : {}),
    defaultValue: props.defaultValue ?? fallback,
    ...(props.onValueChange ? { onValueChange: props.onValueChange } : {}),
  });
  const value = (stored === undefined ? fallback : stored) as T;

  const validation = useFieldValidation<T>({
    value,
    ...(props.rules ? { rules: props.rules } : {}),
    ...(props.lazyRules !== undefined ? { lazyRules: props.lazyRules } : {}),
    ...(props.reactiveRules !== undefined ? { reactiveRules: props.reactiveRules } : {}),
    ...(props.error !== undefined ? { error: props.error } : {}),
    ...(props.errorMessage ? { errorMessage: props.errorMessage } : {}),
    ...(props.disabled !== undefined ? { disabled: props.disabled } : {}),
    ...(props.name ? { name: props.name } : {}),
    ...(focus ? { focus } : {}),
  });

  const describedBy = [
    props.description ? ids.descriptionId : null,
    validation.hasError && validation.errorMessage ? ids.errorId : props.help ? ids.helpId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    value,
    setValue,
    validation,
    ids,
    controlProps: {
      id,
      "aria-invalid": validation.hasError ? true : undefined,
      "aria-describedby": describedBy || undefined,
      "aria-required": props.required ? true : undefined,
      onFocus: validation.onFocus,
      onBlur: validation.onBlur,
    },
    shellProps: {
      label: props.label,
      description: props.description,
      hint: props.hint,
      help: props.help,
      required: props.required,
      size: props.size,
      disabled: props.disabled,
      className: props.className,
      invalid: validation.hasError,
      errorMessage: validation.errorMessage,
      ids,
    },
  };
}
