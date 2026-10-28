import { useRef, type ComponentProps } from "react";

import { cn } from "../../lib/cn";
import { Input } from "../../ui/input";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormInputMoneyProps = FieldProps<number | null> &
  Omit<
    ComponentProps<"input">,
    keyof FieldProps<number | null> | "size" | "ref" | "type" | "min" | "max" | "step"
  > & {
    /** ISO 4217 code. When set, the amount shows the currency symbol. */
    currency?: string;
    locale?: string;
    /** Decimal places. Defaults to the currency's, or 2 without a currency. */
    fractionDigits?: number;
    min?: number;
    max?: number;
  };

const maxDigits = 15;

function fractionDigitsOf(locale: string | undefined, currency: string | undefined) {
  if (!currency) return 2;
  return (
    new Intl.NumberFormat(locale, { style: "currency", currency }).resolvedOptions()
      .maximumFractionDigits ?? 2
  );
}

export function FormInputMoney(props: FormInputMoneyProps) {
  const [
    fieldProps,
    { currency, locale, fractionDigits, min, max, onFocus, onBlur, inputMode, ...rest },
  ] = splitFieldProps<number | null, FormInputMoneyProps>(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useField<number | null>(fieldProps, {
    fallback: null,
    focus: () => inputRef.current?.focus(),
  });
  const { controlProps } = field;
  const size = fieldProps.size ?? "md";

  const digits = fractionDigits ?? fractionDigitsOf(locale, currency);
  const formatter = new Intl.NumberFormat(locale, {
    ...(currency ? { style: "currency", currency } : {}),
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  const text = field.value === null ? "" : formatter.format(field.value);

  const clamp = (value: number) => {
    let next = value;
    if (min !== undefined) next = Math.max(min, next);
    if (max !== undefined) next = Math.min(max, next);
    return next;
  };

  return (
    <FormField {...field.shellProps}>
      <Input
        ref={inputRef}
        {...rest}
        {...controlProps}
        type="text"
        inputMode={inputMode ?? "numeric"}
        autoComplete="off"
        value={text}
        disabled={fieldProps.disabled}
        readOnly={fieldProps.readOnly}
        required={fieldProps.required}
        onChange={(event) => {
          // Typing fills the cents first, the way a calculator or a card terminal does.
          const typed = event.target.value.replace(/\D/g, "").slice(0, maxDigits);
          // Deleting down to nothing but zeros empties the field, so it can be cleared by hand.
          const deleted = event.target.value.length < text.length;
          const empty = typed === "" || (deleted && /^0*$/.test(typed));
          field.setValue(empty ? null : Number(typed) / 10 ** digits);
        }}
        onFocus={composeHandlers(controlProps.onFocus, onFocus)}
        onBlur={composeHandlers(controlProps.onBlur, (event) => {
          onBlur?.(event);
          if (field.value !== null && clamp(field.value) !== field.value) {
            field.setValue(clamp(field.value));
          }
        })}
        className={cn(fieldControlSize[size], "tabular-nums")}
      />
      {fieldProps.name && field.value !== null && (
        <input type="hidden" name={fieldProps.name} value={field.value.toFixed(digits)} />
      )}
    </FormField>
  );
}
