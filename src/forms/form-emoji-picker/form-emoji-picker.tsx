import { useRef, useState, type ReactNode } from "react";
import { SmileIcon, XIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

// Split by grapheme: emojis such as ❤️ are a symbol plus a variation selector.
export const defaultEmojis = Array.from(
  new Intl.Segmenter().segment(
    "😀😃😄😁😆😅😂🙂😉😊😍🥰😎🤩🤔😴😢😭😡🥳" +
      "👍👎👏🙌🙏💪👀🧠❤️🧡💛💚💙💜🖤💯✨🔥⭐🌟🎉🎁🏆🎯" +
      "☀️🌙⛅🌧️❄️🌈🌱🌳🌸🍀🍎🍕🍔🍰☕🍺🎵🎮📚✏️" +
      "💡📌📎📅🔔🔒🔑🛒💼🏠🚗✈️🚀⚙️🔧💰📈✅❌⚠️",
  ),
  (part) => part.segment,
);

export type FormEmojiPickerProps = FieldProps<string> & {
  /** The emojis offered. Defaults to a short general-purpose set. */
  emojis?: string[];
  placeholder?: ReactNode;
  clearable?: boolean;
  columns?: number;
};

export function FormEmojiPicker(props: FormEmojiPickerProps) {
  const [
    fieldProps,
    { emojis = defaultEmojis, placeholder = "Pick an emoji", clearable = false, columns = 8 },
  ] = splitFieldProps<string, FormEmojiPickerProps>(props);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => triggerRef.current?.focus(),
  });
  const { controlProps, ids } = field;
  const size = fieldProps.size ?? "md";
  const [open, setOpen] = useState(false);
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);

  return (
    <FormField {...field.shellProps}>
      <div className="flex items-center gap-1">
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) controlProps.onBlur();
          }}
        >
          <PopoverTrigger asChild>
            <Button
              ref={triggerRef}
              type="button"
              variant="outline"
              id={controlProps.id}
              aria-haspopup="dialog"
              aria-labelledby={fieldProps.label ? `${ids.labelId} ${ids.id}-value` : undefined}
              aria-invalid={controlProps["aria-invalid"]}
              aria-describedby={controlProps["aria-describedby"]}
              disabled={locked}
              onFocus={controlProps.onFocus}
              className={cn(
                "w-full justify-start font-normal",
                fieldControlSize[size],
                !field.value && "text-muted-foreground",
              )}
            >
              {field.value ? null : <SmileIcon className="size-4" />}
              <span id={`${ids.id}-value`}>{field.value || placeholder}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-2">
            <div
              role="group"
              aria-label="Emojis"
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  aria-label={emoji}
                  aria-pressed={emoji === field.value}
                  onClick={() => {
                    field.setValue(emoji);
                    setOpen(false);
                    controlProps.onBlur();
                  }}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md text-lg hover:bg-accent",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    emoji === field.value && "bg-accent",
                  )}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        {clearable && field.value && !locked && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Clear emoji"
            onClick={() => field.setValue("")}
          >
            <XIcon />
          </Button>
        )}
      </div>
      {fieldProps.name && <input type="hidden" name={fieldProps.name} value={field.value} />}
    </FormField>
  );
}
