import { Fragment, useRef } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../../ui/input-otp";
import { FormField } from "../form-field";
import type { FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormPinInputProps = FieldProps<string> & {
  length?: number;
  type?: "numeric" | "text";
  groupSize?: number;
  onComplete?: (value: string) => void;
};

export function FormPinInput(props: FormPinInputProps) {
  const [fieldProps, { length = 6, type = "numeric", groupSize, onComplete }] = splitFieldProps<
    string,
    FormPinInputProps
  >(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => inputRef.current?.focus(),
  });
  const { controlProps } = field;
  const size = groupSize && groupSize > 0 ? groupSize : length;
  const groups = Array.from({ length: Math.ceil(length / size) }, (_, group) =>
    Array.from({ length: Math.min(size, length - group * size) }, (_, slot) => group * size + slot),
  );

  return (
    <FormField {...field.shellProps}>
      <InputOTP
        ref={inputRef}
        id={controlProps.id}
        aria-invalid={controlProps["aria-invalid"]}
        aria-describedby={controlProps["aria-describedby"]}
        name={fieldProps.name}
        maxLength={length}
        value={field.value}
        pattern={type === "numeric" ? REGEXP_ONLY_DIGITS : undefined}
        inputMode={type === "numeric" ? "numeric" : "text"}
        disabled={fieldProps.disabled || fieldProps.readOnly}
        onChange={field.setValue}
        onComplete={onComplete}
        onFocus={controlProps.onFocus}
        onBlur={controlProps.onBlur}
      >
        {groups.map((slots, index) => (
          <Fragment key={index}>
            {index > 0 && <InputOTPSeparator />}
            <InputOTPGroup>
              {slots.map((slot) => (
                <InputOTPSlot key={slot} index={slot} />
              ))}
            </InputOTPGroup>
          </Fragment>
        ))}
      </InputOTP>
    </FormField>
  );
}
