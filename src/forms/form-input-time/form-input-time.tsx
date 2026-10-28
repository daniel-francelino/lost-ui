import { useRef, type ComponentProps } from "react";

import { cn } from "../../lib/cn";
import { Input } from "../../ui/input";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormInputTimeProps = FieldProps<string> &
  Omit<ComponentProps<"input">, keyof FieldProps<string> | "size" | "ref" | "type"> & {
    seconds?: boolean;
  };

export function FormInputTime(props: FormInputTimeProps) {
  const [fieldProps, { seconds = false, step, onFocus, onBlur, ...rest }] = splitFieldProps<
    string,
    FormInputTimeProps
  >(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => inputRef.current?.focus(),
  });
  const size = fieldProps.size ?? "md";
  const { controlProps } = field;

  return (
    <FormField {...field.shellProps}>
      <Input
        ref={inputRef}
        {...rest}
        {...controlProps}
        type="time"
        step={step ?? (seconds ? 1 : 60)}
        name={fieldProps.name}
        value={field.value}
        disabled={fieldProps.disabled}
        readOnly={fieldProps.readOnly}
        required={fieldProps.required}
        onChange={(event) => field.setValue(event.target.value)}
        onFocus={composeHandlers(controlProps.onFocus, onFocus)}
        onBlur={composeHandlers(controlProps.onBlur, onBlur)}
        className={cn(fieldControlSize[size], "w-auto")}
      />
    </FormField>
  );
}
