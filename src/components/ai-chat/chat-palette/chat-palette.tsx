import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";

export type ChatPaletteProps = {
  /** The conversation, usually a `ChatMessages` with `compact`. */
  children?: ReactNode;
  /** The prompt, kept at the bottom. */
  prompt?: ReactNode;
  className?: string;
};

/**
 * The layout of a chat inside something that opens over the page (a modal, a drawer, a command
 * palette): the conversation scrolls above, the prompt stays pinned at the bottom.
 */
export function ChatPalette({ children, prompt, className }: ChatPaletteProps) {
  return (
    <div data-slot="chat-palette" className={cn("flex h-full min-h-0 flex-col", className)}>
      <div data-slot="chat-palette-content" className="flex min-h-0 flex-1 flex-col">
        {children}
      </div>
      {prompt && (
        <div data-slot="chat-palette-prompt" className="shrink-0 border-t p-2">
          {prompt}
        </div>
      )}
    </div>
  );
}
