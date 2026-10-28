import { ExternalLinkIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { ChatAttachment } from "../chat-attachment";
import { ChatReasoning } from "../chat-reasoning";
import { ChatTool } from "../chat-tool";
import { isToolPart, isToolRunning, toolNameOf } from "../chat-parts/parts";
import type { ChatAction, ChatPart, ChatPartContext, ChatRole } from "../chat-parts/types";

export type ChatMessageVariant = "solid" | "soft" | "outline" | "subtle" | "naked";

export type ChatMessageProps = {
  role: ChatRole;
  /** The content, in the parts of the Vercel AI SDK `UIMessage`. */
  parts?: ChatPart[];
  /** The message is the last one and its answer is still coming. */
  streaming?: boolean;
  /** The bubble. By role: `soft` for the user, `naked` (no bubble) for the assistant. */
  variant?: ChatMessageVariant;
  /** `right` puts the message at the end of the line, up to 75% wide. By role: `right` for the user. */
  side?: "left" | "right";
  /** An avatar or icon beside the message. */
  avatar?: ReactNode;
  /** Above the content: a name, a time. */
  header?: ReactNode;
  /** Buttons under the message, shown on hover and focus: copy, regenerate, rate. */
  actions?: ChatAction[];
  compact?: boolean;
  /** Draws the text of a text part, e.g. with a Markdown renderer. */
  renderText?: (text: string, context: ChatPartContext) => ReactNode;
  /** Draws a part its own way. Return `undefined` to use the default. */
  renderPart?: (part: ChatPart, context: ChatPartContext) => ReactNode | undefined;
  className?: string;
  /** Replaces the content of all the parts. */
  children?: ReactNode;
};

const bubbles: Record<ChatMessageVariant, string> = {
  solid: "rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground",
  soft: "rounded-2xl bg-muted px-4 py-2.5 text-foreground",
  outline: "rounded-2xl border bg-background px-4 py-2.5 text-foreground",
  subtle: "rounded-2xl border bg-muted px-4 py-2.5 text-foreground",
  naked: "text-foreground",
};

/**
 * One message of the chat, as an `article`: the bubble, the avatar, the parts (text, reasoning,
 * tool calls, files, sources) and the actions that appear when you point at it.
 */
export function ChatMessage({
  role,
  parts = [],
  streaming = false,
  variant,
  side,
  avatar,
  header,
  actions,
  compact = false,
  renderText,
  renderPart,
  className,
  children,
}: ChatMessageProps) {
  const { t } = useLostTranslation();
  const user = role === "user";
  const resolvedVariant = variant ?? (user ? "soft" : "naked");
  const resolvedSide = side ?? (user ? "right" : "left");
  const right = resolvedSide === "right";

  const content =
    children ??
    parts.map((part, index) => {
      const context: ChatPartContext = {
        role,
        index,
        streaming: streaming && index === parts.length - 1,
      };
      return (
        <div key={index} data-slot="chat-message-part" data-type={part.type}>
          {renderPart?.(part, context) ??
            defaultPart(part, context, renderText, t("aiChat.source"))}
        </div>
      );
    });

  return (
    <article
      data-slot="chat-message"
      data-role={role}
      data-side={resolvedSide}
      data-variant={resolvedVariant}
      className={cn("group/message flex gap-3", right && "flex-row-reverse", className)}
    >
      <span className="sr-only">{user ? t("aiChat.youSaid") : t("aiChat.assistantSaid")}</span>
      {avatar && <div className="shrink-0">{avatar}</div>}
      <div
        className={cn(
          "flex min-w-0 flex-col gap-1",
          right ? "max-w-[75%] items-end" : "flex-1 items-start",
        )}
      >
        {header && <div className="text-xs text-muted-foreground">{header}</div>}
        <div
          data-slot="chat-message-body"
          className={cn(
            "flex min-w-0 max-w-full flex-col break-words",
            compact ? "gap-1.5 text-sm" : "gap-2",
            bubbles[resolvedVariant],
            compact && resolvedVariant !== "naked" && "px-3 py-1.5",
          )}
        >
          {content}
        </div>
        {actions && actions.length > 0 && (
          <div
            data-slot="chat-message-actions"
            className="flex items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover/message:opacity-100 pointer-coarse:opacity-100"
          >
            {actions.map((action) => (
              <Button
                key={action.label}
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground [&_svg]:size-3.5"
                aria-label={action.label}
                title={action.label}
                disabled={action.disabled}
                onClick={action.onClick}
              >
                {action.icon}
              </Button>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function defaultPart(
  part: ChatPart,
  context: ChatPartContext,
  renderText: ChatMessageProps["renderText"],
  sourceLabel: string,
): ReactNode {
  if (part.type === "text") {
    return renderText ? (
      renderText(part.text, context)
    ) : (
      <p className="whitespace-pre-wrap">{part.text}</p>
    );
  }

  if (part.type === "reasoning") {
    const streaming = part.state ? part.state === "streaming" : context.streaming;
    return <ChatReasoning text={part.text} streaming={streaming} />;
  }

  if (isToolPart(part)) {
    const running = isToolRunning(part);
    const failed = part.state === "output-error";
    const detail = failed ? part.errorText : part.output;
    return (
      <ChatTool
        text={part.title ?? toolNameOf(part)}
        streaming={part.state === "input-streaming"}
        loading={running}
        error={failed}
      >
        {detail === undefined ? undefined : (
          <pre className="whitespace-pre-wrap">
            {typeof detail === "string" ? detail : JSON.stringify(detail, null, 2)}
          </pre>
        )}
      </ChatTool>
    );
  }

  if (part.type === "file") {
    const name = part.filename ?? part.url;
    return part.mediaType.startsWith("image/") ? (
      <img src={part.url} alt={name} className="max-h-64 rounded-lg" />
    ) : (
      <ChatAttachment name={name} mediaType={part.mediaType} />
    );
  }

  if (part.type === "source-url") {
    return (
      <a
        href={part.url}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex max-w-full items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        <ExternalLinkIcon aria-hidden="true" className="size-3.5 shrink-0" />
        <span className="truncate">{part.title ?? part.url}</span>
        <span className="sr-only">{sourceLabel}</span>
      </a>
    );
  }

  return null;
}
