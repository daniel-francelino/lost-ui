import { useRef, useState } from "react";
import { XIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import { Badge } from "../../ui/badge";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormInputTagsProps = FieldProps<string[]> & {
  placeholder?: string;
  max?: number;
  delimiter?: string;
  allowDuplicates?: boolean;
  addOnBlur?: boolean;
};

export function FormInputTags(props: FormInputTagsProps) {
  const [
    fieldProps,
    { placeholder, max, delimiter = ",", allowDuplicates = false, addOnBlur = true },
  ] = splitFieldProps<string[], FormInputTagsProps>(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useField<string[]>(fieldProps, {
    fallback: [],
    focus: () => inputRef.current?.focus(),
  });
  const { controlProps } = field;
  const [draft, setDraft] = useState("");
  const size = fieldProps.size ?? "md";
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);
  const full = max !== undefined && field.value.length >= max;

  const add = (raw: string) => {
    const parts = raw
      .split(delimiter)
      .map((part) => part.trim())
      .filter(Boolean);
    let next = field.value;

    for (const part of parts) {
      if (max !== undefined && next.length >= max) break;
      if (!allowDuplicates && next.includes(part)) continue;
      next = [...next, part];
    }

    if (next !== field.value) field.setValue(next);
    setDraft("");
  };

  return (
    <FormField {...field.shellProps}>
      <div
        className={cn(
          "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1 shadow-sm focus-within:ring-1 focus-within:ring-ring",
          locked && "cursor-not-allowed opacity-50",
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {field.value.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            {!locked && (
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={(event) => {
                  event.stopPropagation();
                  field.setValue(field.value.filter((item) => item !== tag));
                }}
                className="rounded-sm outline-none hover:text-destructive focus-visible:ring-1 focus-visible:ring-ring"
              >
                <XIcon className="size-3" />
              </button>
            )}
          </Badge>
        ))}
        <input
          ref={inputRef}
          {...controlProps}
          value={draft}
          placeholder={field.value.length === 0 ? placeholder : undefined}
          disabled={fieldProps.disabled || full}
          readOnly={fieldProps.readOnly}
          onChange={(event) => {
            const raw = event.target.value;
            if (raw.includes(delimiter)) add(raw);
            else setDraft(raw);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (draft.trim()) add(draft);
            } else if (event.key === "Backspace" && draft === "" && field.value.length > 0) {
              field.setValue(field.value.slice(0, -1));
            }
          }}
          onBlur={() => {
            if (addOnBlur && draft.trim()) add(draft);
            controlProps.onBlur();
          }}
          className={cn(
            "min-w-24 flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
            fieldControlSize[size]
              .split(" ")
              .filter((c) => c.startsWith("text-"))
              .join(" "),
          )}
        />
      </div>
      {fieldProps.name &&
        field.value.map((tag) => (
          <input key={tag} type="hidden" name={fieldProps.name} value={tag} />
        ))}
    </FormField>
  );
}
