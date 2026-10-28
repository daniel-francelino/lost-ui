import { useRef, type ComponentProps } from "react";

import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { FormField } from "../form-field";
import type { FieldProps } from "../lib/field-props";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormCheckboxProps = FieldProps<boolean> &
  Omit<ComponentProps<typeof Checkbox>, keyof FieldProps<boolean> | "checked" | "ref"> & {
    indeterminate?: boolean;
  };

export function FormCheckbox(props: FormCheckboxProps) {
  const [fieldProps, { indeterminate = false, onFocus, onBlur, ...rest }] = splitFieldProps<
    boolean,
    FormCheckboxProps
  >(props);
  const boxRef = useRef<HTMLButtonElement>(null);
  const field = useField<boolean>(fieldProps, {
    fallback: false,
    focus: () => boxRef.current?.focus(),
  });
  const { controlProps, ids } = field;

  return (
    <FormField {...field.shellProps} label={undefined} hint={undefined} description={undefined}>
      <div className="flex items-start gap-2">
        <Checkbox
          ref={boxRef}
          {...rest}
          {...controlProps}
          name={fieldProps.name}
          checked={indeterminate ? "indeterminate" : field.value}
          disabled={fieldProps.disabled || fieldProps.readOnly}
          required={fieldProps.required}
          onCheckedChange={(checked) => field.setValue(checked === true)}
          onFocus={composeHandlers(controlProps.onFocus, onFocus)}
          onBlur={composeHandlers(controlProps.onBlur, onBlur)}
        />
        {(fieldProps.label || fieldProps.description) && (
          <div className="grid gap-0.5 leading-none">
            {fieldProps.label && (
              <Label htmlFor={ids.id}>
                {fieldProps.label}
                {fieldProps.required && (
                  <span aria-hidden="true" className="text-destructive">
                    *
                  </span>
                )}
              </Label>
            )}
            {fieldProps.description && (
              <p id={ids.descriptionId} className="text-sm text-muted-foreground">
                {fieldProps.description}
              </p>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}
