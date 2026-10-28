import { useRef, type ComponentProps, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "../../lib/cn";
import { Input } from "../../ui/input";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormInputProps = FieldProps<string> &
  Omit<ComponentProps<"input">, keyof FieldProps<string> | "size" | "ref"> & {
    leading?: ReactNode;
    trailing?: ReactNode;
    loading?: boolean;
  };

export function FormInput(props: FormInputProps) {
  const [fieldProps, { leading, trailing, loading, type = "text", onFocus, onBlur, ...rest }] =
    splitFieldProps<string, FormInputProps>(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => inputRef.current?.focus(),
  });
  const size = fieldProps.size ?? "md";
  const { controlProps } = field;

  return (
    <FormField {...field.shellProps}>
      <div className="relative flex items-center">
        {leading && (
          <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
            {leading}
          </span>
        )}
        <Input
          ref={inputRef}
          {...rest}
          {...controlProps}
          type={type}
          name={fieldProps.name}
          value={field.value}
          disabled={fieldProps.disabled}
          readOnly={fieldProps.readOnly}
          required={fieldProps.required}
          onChange={(event) => field.setValue(event.target.value)}
          onFocus={composeHandlers(controlProps.onFocus, onFocus)}
          onBlur={composeHandlers(controlProps.onBlur, onBlur)}
          className={cn(fieldControlSize[size], leading && "pl-9", (trailing || loading) && "pr-9")}
        />
        {(trailing || loading) && (
          <span className="absolute right-3 flex items-center text-muted-foreground">
            {loading ? (
              <LoaderCircle aria-label="Loading" className="size-4 animate-spin" />
            ) : (
              trailing
            )}
          </span>
        )}
      </div>
    </FormField>
  );
}
