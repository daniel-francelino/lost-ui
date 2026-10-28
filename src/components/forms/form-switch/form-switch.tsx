import { useRef, type ComponentProps } from "react";

import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { FormField } from "../form-field";
import type { FieldProps } from "../lib/field-props";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormSwitchProps = FieldProps<boolean> &
  Omit<ComponentProps<typeof Switch>, keyof FieldProps<boolean> | "checked" | "ref">;

export function FormSwitch(props: FormSwitchProps) {
  const [fieldProps, { onFocus, onBlur, ...rest }] = splitFieldProps<boolean, FormSwitchProps>(
    props,
  );
  const switchRef = useRef<HTMLButtonElement>(null);
  const field = useField<boolean>(fieldProps, {
    fallback: false,
    focus: () => switchRef.current?.focus(),
  });
  const { controlProps, ids } = field;

  return (
    <FormField {...field.shellProps} label={undefined} hint={undefined} description={undefined}>
      <div className="flex items-center justify-between gap-4">
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
        <Switch
          ref={switchRef}
          {...rest}
          {...controlProps}
          name={fieldProps.name}
          checked={field.value}
          disabled={fieldProps.disabled || fieldProps.readOnly}
          required={fieldProps.required}
          onCheckedChange={(checked) => field.setValue(checked)}
          onFocus={composeHandlers(controlProps.onFocus, onFocus)}
          onBlur={composeHandlers(controlProps.onBlur, onBlur)}
        />
      </div>
    </FormField>
  );
}
