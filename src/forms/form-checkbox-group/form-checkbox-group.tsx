import { useRef } from "react";

import { cn } from "../../lib/cn";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { FormField } from "../form-field";
import type { FieldProps } from "../lib/field-props";
import { normalizeItems, type ItemInput } from "../lib/items";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormCheckboxGroupProps = FieldProps<string[]> & {
  items: ItemInput[];
  orientation?: "vertical" | "horizontal";
};

export function FormCheckboxGroup(props: FormCheckboxGroupProps) {
  const [fieldProps, { items, orientation = "vertical" }] = splitFieldProps<
    string[],
    FormCheckboxGroupProps
  >(props);
  const groupRef = useRef<HTMLDivElement>(null);
  const field = useField<string[]>(fieldProps, {
    fallback: [],
    focus: () => groupRef.current?.querySelector<HTMLElement>("button[role='checkbox']")?.focus(),
  });
  const { controlProps, ids } = field;
  const selected = field.value;

  return (
    <FormField {...field.shellProps}>
      <div
        ref={groupRef}
        id={controlProps.id}
        role="group"
        aria-labelledby={fieldProps.label ? ids.labelId : undefined}
        aria-invalid={controlProps["aria-invalid"]}
        aria-describedby={controlProps["aria-describedby"]}
        onFocus={controlProps.onFocus}
        onBlur={controlProps.onBlur}
        className={cn(
          "grid gap-2",
          orientation === "horizontal" && "grid-flow-col auto-cols-max gap-4",
        )}
      >
        {normalizeItems(items).map((item) => {
          const itemId = `${ids.id}-${item.value}`;

          return (
            <div key={item.value} className="flex items-start gap-2">
              <Checkbox
                id={itemId}
                name={fieldProps.name}
                value={item.value}
                checked={selected.includes(item.value)}
                disabled={item.disabled || fieldProps.disabled || fieldProps.readOnly}
                onCheckedChange={(checked) =>
                  field.setValue(
                    checked === true
                      ? [...selected, item.value]
                      : selected.filter((value) => value !== item.value),
                  )
                }
              />
              <div className="grid gap-0.5 leading-none">
                <Label htmlFor={itemId}>{item.label}</Label>
                {item.description && (
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </FormField>
  );
}
