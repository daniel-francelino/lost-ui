import { useRef, type ComponentProps } from "react";

import { Slider } from "../../ui/slider";
import { FormField } from "../form-field";
import type { FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormSliderValue = number | number[];

export type FormSliderProps = FieldProps<FormSliderValue> &
  Pick<
    ComponentProps<typeof Slider>,
    "min" | "max" | "step" | "orientation" | "minStepsBetweenThumbs"
  > & {
    showValue?: boolean;
  };

export function FormSlider(props: FormSliderProps) {
  const [
    fieldProps,
    { min = 0, max = 100, step = 1, orientation, minStepsBetweenThumbs, showValue },
  ] = splitFieldProps<FormSliderValue, FormSliderProps>(props);
  const sliderRef = useRef<HTMLSpanElement>(null);
  const field = useField<FormSliderValue>(fieldProps, {
    fallback: min,
    focus: () => sliderRef.current?.querySelector<HTMLElement>("[role='slider']")?.focus(),
  });
  const { controlProps, ids } = field;
  const range = Array.isArray(field.value);
  const values = Array.isArray(field.value) ? field.value : [field.value];

  return (
    <FormField
      {...field.shellProps}
      hint={fieldProps.hint ?? (showValue ? values.join(" – ") : undefined)}
    >
      <Slider
        ref={sliderRef}
        id={controlProps.id}
        aria-labelledby={fieldProps.label ? ids.labelId : undefined}
        aria-describedby={controlProps["aria-describedby"]}
        name={fieldProps.name}
        value={values}
        min={min}
        max={max}
        step={step}
        orientation={orientation}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        disabled={fieldProps.disabled || fieldProps.readOnly}
        onValueChange={(next) => field.setValue(range ? next : (next[0] ?? min))}
        onFocus={controlProps.onFocus}
        onBlur={controlProps.onBlur}
      />
    </FormField>
  );
}
