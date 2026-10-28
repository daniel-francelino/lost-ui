import { useEffect, useRef, type ComponentProps } from "react";

import { cn } from "../../../lib/cn";
import { Textarea } from "../../ui/textarea";
import { FormField } from "../form-field";
import { fieldTextSize, type FieldProps } from "../lib/field-props";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormTextareaProps = FieldProps<string> &
  Omit<ComponentProps<"textarea">, keyof FieldProps<string> | "ref"> & {
    autoresize?: boolean;
    maxRows?: number;
  };

export function FormTextarea(props: FormTextareaProps) {
  const [fieldProps, { autoresize = false, maxRows, rows = 3, onFocus, onBlur, ...rest }] =
    splitFieldProps<string, FormTextareaProps>(props);
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => areaRef.current?.focus(),
  });
  const size = fieldProps.size ?? "md";
  const { controlProps } = field;

  useEffect(() => {
    const area = areaRef.current;
    if (!autoresize || !area) return;

    area.style.height = "auto";
    const lineHeight = Number.parseFloat(getComputedStyle(area).lineHeight) || 20;
    const limit = maxRows ? lineHeight * maxRows : Number.POSITIVE_INFINITY;
    area.style.height = `${Math.min(area.scrollHeight, limit)}px`;
  }, [autoresize, maxRows, field.value]);

  return (
    <FormField {...field.shellProps}>
      <Textarea
        ref={areaRef}
        {...rest}
        {...controlProps}
        rows={rows}
        name={fieldProps.name}
        value={field.value}
        disabled={fieldProps.disabled}
        readOnly={fieldProps.readOnly}
        required={fieldProps.required}
        onChange={(event) => field.setValue(event.target.value)}
        onFocus={composeHandlers(controlProps.onFocus, onFocus)}
        onBlur={composeHandlers(controlProps.onBlur, onBlur)}
        className={cn(fieldTextSize[size], autoresize && "resize-none overflow-hidden")}
      />
    </FormField>
  );
}
