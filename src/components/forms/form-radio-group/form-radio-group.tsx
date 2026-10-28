import { useRef } from "react";

import { cn } from "../../../lib/cn";
import { Label } from "../../ui/label";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { FormField } from "../form-field";
import type { FieldProps } from "../lib/field-props";
import { normalizeItems, type ItemInput } from "../lib/items";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormRadioGroupProps = FieldProps<string> & {
  items: ItemInput[];
  orientation?: "vertical" | "horizontal";
};

export function FormRadioGroup(props: FormRadioGroupProps) {
  const [fieldProps, { items, orientation = "vertical" }] = splitFieldProps<
    string,
    FormRadioGroupProps
  >(props);
  const groupRef = useRef<HTMLDivElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => groupRef.current?.querySelector<HTMLElement>("button[role='radio']")?.focus(),
  });
  const { controlProps, ids } = field;

  return (
    <FormField {...field.shellProps}>
      <RadioGroup
        ref={groupRef}
        id={controlProps.id}
        aria-labelledby={fieldProps.label ? ids.labelId : undefined}
        aria-invalid={controlProps["aria-invalid"]}
        aria-describedby={controlProps["aria-describedby"]}
        name={fieldProps.name}
        value={field.value}
        disabled={fieldProps.disabled || fieldProps.readOnly}
        required={fieldProps.required}
        orientation={orientation}
        onValueChange={field.setValue}
        onFocus={controlProps.onFocus}
        onBlur={controlProps.onBlur}
        className={cn(orientation === "horizontal" && "grid-flow-col auto-cols-max gap-4")}
      >
        {normalizeItems(items).map((item) => {
          const itemId = `${ids.id}-${item.value}`;

          return (
            <div key={item.value} className="flex items-start gap-2">
              <RadioGroupItem id={itemId} value={item.value} disabled={item.disabled} />
              <div className="grid gap-0.5 leading-none">
                <Label htmlFor={itemId}>{item.label}</Label>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </FormField>
  );
}
