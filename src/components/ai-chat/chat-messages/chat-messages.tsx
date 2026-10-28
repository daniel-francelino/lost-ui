import { ArrowDownIcon } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { ChatMessage, type ChatMessageProps } from "../chat-message";
import { ChatShimmer } from "../chat-shimmer";
import type { ChatAction, ChatMessageData, ChatStatus } from "../chat-parts/types";

type RoleProps = Pick<ChatMessageProps, "variant" | "side" | "avatar" | "compact">;

export type ChatMessagesProps = {
  messages?: ChatMessageData[];
  /** `submitted` shows the indicator while the answer has not started. */
  status?: ChatStatus;
  /** Follows the answer as it grows, as long as the user has not scrolled up. */
  autoScroll?: boolean;
  /** The button that goes back to the latest message when the user scrolled up. */
  scrollButton?: boolean;
  /** Replaces the dots-and-text shown while the answer has not started. */
  indicator?: ReactNode;
  /** Props for the messages of the user: `variant`, `side`, `avatar`. */
  user?: RoleProps;
  /** Props for the messages of the assistant: `variant`, `side`, `avatar`. */
  assistant?: RoleProps;
  compact?: boolean;
  /** The buttons under each message, e.g. copy and regenerate. */
  getActions?: (message: ChatMessageData, isLast: boolean) => ChatAction[] | undefined;
  renderText?: ChatMessageProps["renderText"];
  renderPart?: ChatMessageProps["renderPart"];
  /** Shown when there are no messages: a welcome and some suggestions. */
  empty?: ReactNode;
  /** Stays at the bottom, e.g. the prompt. The list leaves room for it. */
  footer?: ReactNode;
  className?: string;
  /** Messages drawn by hand, in place of `messages`. */
  children?: ReactNode;
};

const NEAR_BOTTOM = 48;

/**
 * The conversation: the messages in a column that scrolls, a button to get back to the latest,
 * an indicator while the answer is awaited, and a footer for the prompt. It follows the answer as
 * it streams, unless the user scrolled up to read.
 */
export function ChatMessages({
  messages = [],
  status = "ready",
  autoScroll = true,
  scrollButton = true,
  indicator,
  user,
  assistant,
  compact = false,
  getActions,
  renderText,
  renderPart,
  empty,
  footer,
  className,
  children,
}: ChatMessagesProps) {
  const { t } = useLostTranslation();
  const viewport = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const stuck = useRef(true);
  const [atBottom, setAtBottom] = useState(true);
  const waiting = status === "submitted";
  const answering = status === "submitted" || status === "streaming";
  const last = messages.at(-1);

  const scrollToBottom = useCallback((smooth = false) => {
    const element = viewport.current;
    if (!element) return;
    if (smooth && typeof element.scrollTo === "function") {
      element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
    } else {
      element.scrollTop = element.scrollHeight;
    }
  }, []);

  useLayoutEffect(() => scrollToBottom(), [scrollToBottom]);

  useEffect(() => {
    if (last?.role === "user") stuck.current = true;
    if (stuck.current) scrollToBottom();
  }, [messages, status, last?.role, scrollToBottom]);

  useEffect(() => {
    const node = content.current;
    if (!node || !autoScroll || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (stuck.current) scrollToBottom();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoScroll, scrollToBottom]);

  const onScroll = () => {
    const element = viewport.current;
    if (!element) return;
    const near = element.scrollHeight - element.scrollTop - element.clientHeight <= NEAR_BOTTOM;
    stuck.current = near;
    setAtBottom(near);
  };

  const list =
    children ??
    messages.map((message, index) => {
      const isLast = index === messages.length - 1;
      const roleProps = message.role === "user" ? user : assistant;
      return (
        <ChatMessage
          key={message.id}
          role={message.role}
          parts={message.parts}
          streaming={isLast && answering && message.role === "assistant"}
          compact={compact}
          actions={getActions?.(message, isLast)}
          renderText={renderText}
          renderPart={renderPart}
          {...roleProps}
        />
      );
    });

  const isEmpty = !children && messages.length === 0;

  return (
    <div
      data-slot="chat-messages"
      className={cn("relative flex min-h-0 flex-1 flex-col", className)}
    >
      <div
        ref={viewport}
        role="log"
        aria-label={t("aiChat.conversation")}
        aria-live="polite"
        aria-relevant="additions text"
        aria-busy={answering}
        onScroll={onScroll}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto"
      >
        <div
          ref={content}
          className={cn(
            "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6",
            isEmpty && "justify-center",
          )}
        >
          {isEmpty ? empty : list}
          {waiting && (
            <div data-slot="chat-messages-indicator" className="text-sm">
              {indicator ?? <ChatShimmer text={t("aiChat.thinking")} />}
            </div>
          )}
        </div>
      </div>
      {scrollButton && !atBottom && (
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("aiChat.scrollToBottom")}
          onClick={() => {
            stuck.current = true;
            setAtBottom(true);
            scrollToBottom(true);
          }}
          className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full shadow-md"
        >
          <ArrowDownIcon aria-hidden="true" />
        </Button>
      )}
      {footer && (
        <div
          data-slot="chat-messages-footer"
          className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4"
        >
          {footer}
        </div>
      )}
    </div>
  );
}
