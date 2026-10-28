import { useRef } from "react";

import { cn } from "../../lib/cn";
import { Input } from "../../ui/input";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormColorPickerProps = FieldProps<string> & {
  swatches?: string[];
  placeholder?: string;
};

export function FormColorPicker(props: FormColorPickerProps) {
  const [fieldProps, { swatches, placeholder = "#000000" }] = splitFieldProps<
    string,
    FormColorPickerProps
  >(props);
  const textRef = useRef<HTMLInputElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => textRef.current?.focus(),
  });
  const { controlProps } = field;
  const size = fieldProps.size ?? "md";
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);
  const valid = /^#[0-9a-f]{6}$/i.test(field.value);

  return (
    <FormField {...field.shellProps}>
      <div className="flex items-center gap-2">
        <input
          type="color"
          aria-label="Pick a color"
          value={valid ? field.value : "#000000"}
          disabled={locked}
          onChange={(event) => field.setValue(event.target.value)}
          onFocus={controlProps.onFocus}
          onBlur={controlProps.onBlur}
          className="size-9 shrink-0 cursor-pointer rounded-md border border-input bg-transparent p-1 disabled:cursor-not-allowed"
        />
        <Input
          ref={textRef}
          {...controlProps}
          name={fieldProps.name}
          value={field.value}
          placeholder={placeholder}
          disabled={fieldProps.disabled}
          readOnly={fieldProps.readOnly}
          required={fieldProps.required}
          spellCheck={false}
          onChange={(event) => field.setValue(event.target.value)}
          className={cn(fieldControlSize[size], "font-mono")}
        />
      </div>
      {swatches && swatches.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Swatches">
          {swatches.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Use ${color}`}
              aria-pressed={field.value.toLowerCase() === color.toLowerCase()}
              disabled={locked}
              onClick={() => field.setValue(color)}
              style={{ backgroundColor: color }}
              className="size-6 rounded-full border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring aria-pressed:ring-2 aria-pressed:ring-ring disabled:cursor-not-allowed"
            />
          ))}
        </div>
      )}
    </FormField>
  );
}
