import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";

export type ChatSuggestion = {
  label: string;
  /** What is sent when it is picked. Defaults to the label. */
  value?: string;
  icon?: ReactNode;
};

export type ChatSuggestionsProps = {
  suggestions: (string | ChatSuggestion)[];
  onSelect?: (value: string) => void;
  /** `row` wraps in a line, `grid` makes cards that fill two columns. */
  layout?: "row" | "grid";
  disabled?: boolean;
  className?: string;
};

/** Prompts to start with, or to follow up with: one click sends one. */
export function ChatSuggestions({
  suggestions,
  onSelect,
  layout = "row",
  disabled,
  className,
}: ChatSuggestionsProps) {
  const { t } = useLostTranslation();

  return (
    <ul
      data-slot="chat-suggestions"
      data-layout={layout}
      aria-label={t("aiChat.suggestions")}
      className={cn(
        layout === "grid" ? "grid gap-2 sm:grid-cols-2" : "flex flex-wrap gap-2",
        className,
      )}
    >
      {suggestions.map((item) => {
        const suggestion = typeof item === "string" ? { label: item } : item;
        return (
          <li key={suggestion.label} className={cn(layout === "grid" && "flex")}>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => onSelect?.(suggestion.value ?? suggestion.label)}
              className={cn(
                layout === "grid"
                  ? "h-auto w-full justify-start whitespace-normal rounded-xl px-4 py-3 text-left font-normal"
                  : "rounded-full font-normal",
              )}
            >
              {suggestion.icon}
              {suggestion.label}
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
