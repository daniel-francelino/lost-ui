import { useLayoutEffect, useMemo, useRef, type ComponentProps, type ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

import { cn } from "../../lib/cn";
import { Input } from "../../ui/input";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";
import { applyMask, defaultMaskTokens, type MaskTokens } from "./mask";

export type FormInputProps = FieldProps<string> &
  Omit<ComponentProps<"input">, keyof FieldProps<string> | "size" | "ref"> & {
    leading?: ReactNode;
    trailing?: ReactNode;
    loading?: boolean;
    /**
     * Shapes what is typed, e.g. `"(##) #####-####"`. `#` is a digit, `S` a letter, `N` a letter
     * or digit, `A`/`a` a letter in upper/lower case, `X`/`x` a letter or digit in upper/lower
     * case; anything else is a literal. An array of masks picks the shortest one that fits,
     * e.g. CPF or CNPJ.
     */
    mask?: string | string[];
    /** Extra mask slots, or a replacement for a default one, by character. */
    maskTokens?: MaskTokens;
    /** Keeps the value without the literals of the mask (`11987654321`). The input still shows them. */
    unmask?: boolean;
  };

export function FormInput(props: FormInputProps) {
  const [
    fieldProps,
    {
      leading,
      trailing,
      loading,
      mask,
      maskTokens,
      unmask = false,
      type = "text",
      onFocus,
      onBlur,
      ...rest
    },
  ] = splitFieldProps<string, FormInputProps>(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const caret = useRef<number | null>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => inputRef.current?.focus(),
  });
  const size = fieldProps.size ?? "md";
  const { controlProps } = field;
  const tokens = useMemo(() => ({ ...defaultMaskTokens, ...maskTokens }), [maskTokens]);
  const shown = mask ? applyMask(field.value, mask, tokens) : undefined;
  const text = shown?.text ?? field.value;

  // Typing in the middle of a masked text moves the caret to the end unless it is put back.
  useLayoutEffect(() => {
    if (caret.current !== null && inputRef.current === document.activeElement) {
      inputRef.current?.setSelectionRange(caret.current, caret.current);
    }
    caret.current = null;
  });

  const change = (typed: string, caretAt: number | null) => {
    if (!mask) return field.setValue(typed);

    const result = applyMask(typed, mask, tokens);
    // Deleting removes the literal that closed the text too, or backspace would stall on it.
    const deleting = typed.length < text.length;
    const next = deleting
      ? result.text.slice(0, result.text.length - result.trailing)
      : result.text;

    caret.current = applyMask(typed.slice(0, caretAt ?? typed.length), mask, tokens).text.length;
    field.setValue(unmask ? result.raw : next);
  };

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
          name={unmask ? undefined : fieldProps.name}
          value={text}
          disabled={fieldProps.disabled}
          readOnly={fieldProps.readOnly}
          required={fieldProps.required}
          onChange={(event) => change(event.target.value, event.target.selectionStart)}
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
      {unmask && fieldProps.name && (
        <input type="hidden" name={fieldProps.name} value={shown?.raw ?? field.value} />
      )}
    </FormField>
  );
}
