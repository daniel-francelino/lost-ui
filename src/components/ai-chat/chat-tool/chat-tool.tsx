import { ChevronDownIcon, CircleXIcon, LoaderCircleIcon, WrenchIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { ChatShimmer } from "../chat-shimmer";

export type ChatToolProps = {
  /** What the tool does or did: "Searching components", "Lint checks completed". */
  text: string;
  /** Smaller text after the label, e.g. the query. */
  suffix?: string;
  icon?: ReactNode;
  /** The tool is being written: the label shimmers. */
  streaming?: boolean;
  /** The tool is running: a spinner replaces the icon. */
  loading?: boolean;
  /** The tool failed. */
  error?: boolean;
  /** `inline` is a line of text, `card` is a bordered block. */
  variant?: "inline" | "card";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Buttons under the label, e.g. "Approve" and "Deny". */
  actions?: ReactNode;
  className?: string;
  /** The output of the tool. With it the block opens and closes. */
  children?: ReactNode;
};

/** A tool call of the assistant: its state in one line, and its output when you open it. */
export function ChatTool({
  text,
  suffix,
  icon,
  streaming = false,
  loading = false,
  error = false,
  variant = "inline",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  actions,
  className,
  children,
}: ChatToolProps) {
  const [inner, setInner] = useState(defaultOpen);
  const open = openProp ?? inner;
  const collapsible = children !== undefined && children !== null && children !== false;

  const leading = loading ? (
    <LoaderCircleIcon aria-hidden="true" className="animate-spin" />
  ) : error ? (
    <CircleXIcon aria-hidden="true" className="text-destructive" />
  ) : (
    (icon ?? <WrenchIcon aria-hidden="true" />)
  );

  const label = (
    <>
      {leading}
      <span className={cn("min-w-0 truncate", error && "text-destructive")}>
        {streaming ? <ChatShimmer text={text} /> : text}
      </span>
      {suffix && <span className="min-w-0 truncate text-muted-foreground/70">{suffix}</span>}
    </>
  );

  const triggerClass =
    "group flex w-full min-w-0 items-center gap-2 rounded-md text-left text-sm text-muted-foreground outline-none transition-colors [&_svg]:size-4 [&_svg]:shrink-0";

  return (
    <Collapsible
      data-slot="chat-tool"
      data-variant={variant}
      data-state={error ? "error" : loading ? "loading" : "done"}
      open={collapsible ? open : false}
      onOpenChange={(next) => {
        setInner(next);
        onOpenChange?.(next);
      }}
      className={cn(variant === "card" && "rounded-lg border bg-card p-3 shadow-xs", className)}
    >
      {collapsible ? (
        <CollapsibleTrigger
          className={cn(
            triggerClass,
            "hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
          )}
        >
          {label}
          <ChevronDownIcon
            aria-hidden="true"
            className="ml-auto transition-transform group-data-[state=open]:rotate-180"
          />
        </CollapsibleTrigger>
      ) : (
        <div className={triggerClass}>{label}</div>
      )}
      {actions && <div className="mt-2 flex flex-wrap gap-2">{actions}</div>}
      {collapsible && (
        <CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1">
          <div className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-xs text-foreground">
            {children}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}
