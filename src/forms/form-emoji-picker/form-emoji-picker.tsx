import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { SmileIcon, XIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FormEmojiPickerProps = FieldProps<string> & {
  placeholder?: ReactNode;
  searchPlaceholder?: string;
  clearable?: boolean;
  /** Passed to `emoji-picker-react`, e.g. `theme`, `width`, `skinTonesDisabled`. */
  pickerProps?: Omit<ComponentProps<typeof EmojiPicker>, "onEmojiClick" | "searchPlaceholder">;
};

/**
 * An emoji field with the full `emoji-picker-react` picker (search, categories, skin tones).
 * Needs the optional peer `emoji-picker-react`.
 */
export function FormEmojiPicker(props: FormEmojiPickerProps) {
  const [
    fieldProps,
    {
      placeholder = "Pick an emoji",
      searchPlaceholder = "Search emoji",
      clearable = false,
      pickerProps,
    },
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
          <PopoverContent align="start" className="w-auto border-0 p-0">
            <EmojiPicker
              theme={Theme.AUTO}
              emojiStyle={EmojiStyle.NATIVE}
              lazyLoadEmojis
              previewConfig={{ showPreview: false }}
              width={320}
              height={380}
              {...pickerProps}
              searchPlaceholder={searchPlaceholder}
              onEmojiClick={(emoji) => {
                field.setValue(emoji.emoji);
                setOpen(false);
                controlProps.onBlur();
              }}
            />
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
