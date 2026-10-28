import { ArrowUpIcon, RotateCcwIcon, SquareIcon } from "lucide-react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button, type ButtonProps } from "../../ui/button";
import type { ChatStatus } from "../chat-parts/types";

export type ChatPromptSubmitProps = Omit<ButtonProps, "children" | "onClick" | "type"> & {
  status?: ChatStatus;
  /** Clicked while the answer is coming (`submitted` or `streaming`). */
  onStop?: () => void;
  /** Clicked after an error. */
  onReload?: () => void;
};

/**
 * The button of a prompt. It sends when ready, stops while the answer comes and tries again after
 * an error, with an icon and a name for screen readers for each.
 */
export function ChatPromptSubmit({
  status = "ready",
  onStop,
  onReload,
  variant,
  ...props
}: ChatPromptSubmitProps) {
  const { t } = useLostTranslation();

  if (status === "submitted" || status === "streaming") {
    return (
      <Button
        data-slot="chat-prompt-submit"
        data-status={status}
        type="button"
        size="icon"
        variant={variant ?? "secondary"}
        aria-label={t("aiChat.stop")}
        onClick={onStop}
        {...props}
      >
        <SquareIcon aria-hidden="true" className="fill-current" />
      </Button>
    );
  }

  if (status === "error") {
    return (
      <Button
        data-slot="chat-prompt-submit"
        data-status={status}
        type="button"
        size="icon"
        variant={variant ?? "destructive"}
        aria-label={t("aiChat.retry")}
        onClick={onReload}
        {...props}
      >
        <RotateCcwIcon aria-hidden="true" />
      </Button>
    );
  }

  return (
    <Button
      data-slot="chat-prompt-submit"
      data-status={status}
      type="submit"
      size="icon"
      variant={variant}
      aria-label={t("aiChat.send")}
      {...props}
    >
      <ArrowUpIcon aria-hidden="true" />
    </Button>
  );
}
