import { useEffect, useRef, useState, type ComponentProps } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormInputNumberProps = FieldProps<number | null> &
  Omit<
    ComponentProps<"input">,
    keyof FieldProps<number | null> | "size" | "ref" | "type" | "min" | "max" | "step"
  > & {
    min?: number;
    max?: number;
    step?: number;
    showControls?: boolean;
  };

const partial = /^-?\d*\.?\d*$/;

function clamp(value: number, min?: number, max?: number) {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
}

function show(value: number | null) {
  return value === null ? "" : String(value);
}

export function FormInputNumber(props: FormInputNumberProps) {
  const { t } = useLostTranslation();
  const [fieldProps, { min, max, step = 1, showControls = true, onFocus, onBlur, ...rest }] =
    splitFieldProps<number | null, FormInputNumberProps>(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useField<number | null>(fieldProps, {
    fallback: null,
    focus: () => inputRef.current?.focus(),
  });
  const { controlProps } = field;
  const size = fieldProps.size ?? "md";
  const [text, setText] = useState(show(field.value));
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);

  useEffect(() => {
    const typed = text === "" || text === "-" || text === "." ? null : Number(text);
    if (typed !== field.value) setText(show(field.value));
    // only re-sync when the value changes from outside
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.value]);

  const commit = (next: number | null) => {
    setText(show(next));
    field.setValue(next);
  };

  const bump = (direction: 1 | -1) => {
    const base = field.value ?? 0;
    const decimals = (String(step).split(".")[1] ?? "").length;
    commit(clamp(Number((base + direction * step).toFixed(decimals)), min, max));
  };

  return (
    <FormField {...field.shellProps}>
      <div className="flex items-center gap-1">
        {showControls && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("number.decrement")}
            disabled={locked || (min !== undefined && (field.value ?? 0) <= min)}
            onClick={() => bump(-1)}
            className="shrink-0"
          >
            <MinusIcon />
          </Button>
        )}
        <Input
          ref={inputRef}
          {...rest}
          {...controlProps}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={field.value ?? undefined}
          name={fieldProps.name}
          value={text}
          disabled={fieldProps.disabled}
          readOnly={fieldProps.readOnly}
          required={fieldProps.required}
          onChange={(event) => {
            const raw = event.target.value;
            if (!partial.test(raw)) return;
            setText(raw);
            if (raw === "" || raw === "-" || raw === ".") {
              field.setValue(null);
            } else {
              field.setValue(Number(raw));
            }
          }}
          onKeyDown={(event) => {
            if (locked) return;
            if (event.key === "ArrowUp") {
              event.preventDefault();
              bump(1);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              bump(-1);
            }
          }}
          onFocus={composeHandlers(controlProps.onFocus, onFocus)}
          onBlur={composeHandlers(controlProps.onBlur, (event) => {
            onBlur?.(event);
            if (field.value !== null) {
              const next = clamp(field.value, min, max);
              if (next !== field.value) commit(next);
              else setText(show(next));
            }
          })}
          className={cn(fieldControlSize[size], "text-center")}
        />
        {showControls && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={t("number.increment")}
            disabled={locked || (max !== undefined && (field.value ?? 0) >= max)}
            onClick={() => bump(1)}
            className="shrink-0"
          >
            <PlusIcon />
          </Button>
        )}
      </div>
    </FormField>
  );
}
