import { useRef, type ComponentType } from "react";
import { StarIcon } from "lucide-react";

import { cn } from "../../../lib/cn";
import { FormField } from "../form-field";
import type { FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormInputRatingProps = FieldProps<number> & {
  max?: number;
  icon?: ComponentType<{ className?: string }>;
  clearable?: boolean;
};

export function FormInputRating(props: FormInputRatingProps) {
  const [fieldProps, { max = 5, icon: Icon = StarIcon, clearable = true }] = splitFieldProps<
    number,
    FormInputRatingProps
  >(props);
  const groupRef = useRef<HTMLDivElement>(null);
  const field = useField<number>(fieldProps, {
    fallback: 0,
    focus: () => groupRef.current?.querySelector<HTMLElement>("button")?.focus(),
  });
  const { controlProps, ids } = field;
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);

  return (
    <FormField {...field.shellProps}>
      <div
        ref={groupRef}
        id={controlProps.id}
        role="radiogroup"
        aria-labelledby={fieldProps.label ? ids.labelId : undefined}
        aria-invalid={controlProps["aria-invalid"]}
        aria-describedby={controlProps["aria-describedby"]}
        onFocus={controlProps.onFocus}
        onBlur={controlProps.onBlur}
        className="inline-flex gap-1"
      >
        {Array.from({ length: max }, (_, index) => {
          const score = index + 1;
          const active = score <= field.value;

          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={field.value === score}
              aria-label={`${score} of ${max}`}
              disabled={locked}
              tabIndex={field.value === score || (field.value === 0 && score === 1) ? 0 : -1}
              onClick={() => field.setValue(clearable && field.value === score ? 0 : score)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                  event.preventDefault();
                  field.setValue(Math.min(max, field.value + 1));
                } else if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                  event.preventDefault();
                  field.setValue(Math.max(0, field.value - 1));
                }
              }}
              className="rounded-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed"
            >
              <Icon className={cn("size-6", active && "fill-current text-primary")} />
            </button>
          );
        })}
      </div>
      {fieldProps.name && <input type="hidden" name={fieldProps.name} value={field.value} />}
    </FormField>
  );
}
