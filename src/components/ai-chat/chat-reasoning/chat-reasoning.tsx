import { ChevronDownIcon } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useControlled } from "../../../lib/use-controlled";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../../ui/collapsible";
import { ChatShimmer } from "../chat-shimmer";

export type ChatReasoningProps = {
  /** What the model thought. Shown in the body when there are no `children`. */
  text?: string;
  /** The thought is still being written: the label shimmers and the block opens. */
  streaming?: boolean;
  /** Seconds the model thought. Without it, the time between the start and the end of `streaming`. */
  duration?: number;
  icon?: ReactNode;
  /** Opens by itself when `streaming` starts and closes when it ends. */
  autoOpen?: boolean;
  /** Milliseconds between the end of `streaming` and the closing. `0` keeps it open. */
  autoCloseDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: ReactNode;
};

/** The "thinking" of the model, in a block that opens while it streams and closes when it is done. */
export function ChatReasoning({
  text,
  streaming = false,
  duration,
  icon,
  autoOpen = true,
  autoCloseDelay = 500,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: ChatReasoningProps) {
  const { t } = useLostTranslation();
  const [openValue, setOpen] = useControlled<boolean>({
    value: openProp,
    defaultValue: defaultOpen,
    onValueChange: onOpenChange,
  });
  const open = openValue ?? false;
  const startedAt = useRef<number | null>(null);
  const toggledByUser = useRef(false);
  const [measured, setMeasured] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (streaming) {
      startedAt.current = Date.now();
      toggledByUser.current = false;
      if (autoOpen) setOpen(true);
      return;
    }
    if (startedAt.current === null) return;
    setMeasured(Math.max(1, Math.round((Date.now() - startedAt.current) / 1000)));
    startedAt.current = null;
    if (!autoOpen || autoCloseDelay <= 0 || toggledByUser.current) return;
    const id = setTimeout(() => setOpen(false), autoCloseDelay);
    return () => clearTimeout(id);
  }, [streaming, autoOpen, autoCloseDelay, setOpen]);

  const seconds = duration ?? measured;
  const label = streaming ? (
    <ChatShimmer text={t("aiChat.thinking")} />
  ) : seconds ? (
    t("aiChat.thoughtFor", { count: seconds })
  ) : (
    t("aiChat.thought")
  );

  return (
    <Collapsible
      data-slot="chat-reasoning"
      open={open}
      onOpenChange={(next) => {
        toggledByUser.current = true;
        setOpen(next);
      }}
      className={cn("text-sm", className)}
    >
      <CollapsibleTrigger className="group flex items-center gap-1.5 rounded-md py-0.5 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-4">
        {icon}
        <span>{label}</span>
        <ChevronDownIcon
          aria-hidden="true"
          className="transition-transform group-data-[state=open]:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1">
        <div className="mt-1 whitespace-pre-wrap border-l-2 pl-3 text-muted-foreground">
          {children ?? text}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
