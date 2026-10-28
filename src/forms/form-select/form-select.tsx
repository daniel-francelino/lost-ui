import { useRef } from "react";

import { cn } from "../../lib/cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { normalizeItems, type ItemInput } from "../lib/items";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormSelectProps = FieldProps<string> & {
  items: ItemInput[];
  placeholder?: string;
};

export function FormSelect(props: FormSelectProps) {
  const [fieldProps, { items, placeholder }] = splitFieldProps<string, FormSelectProps>(props);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => triggerRef.current?.focus(),
  });
  const { controlProps } = field;
  const size = fieldProps.size ?? "md";

  return (
    <FormField {...field.shellProps}>
      <Select
        value={field.value}
        onValueChange={field.setValue}
        name={fieldProps.name}
        disabled={fieldProps.disabled || fieldProps.readOnly}
        required={fieldProps.required}
      >
        <SelectTrigger
          ref={triggerRef}
          {...controlProps}
          className={cn("w-full", fieldControlSize[size])}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {normalizeItems(items).map((item) => (
            <SelectItem key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}
