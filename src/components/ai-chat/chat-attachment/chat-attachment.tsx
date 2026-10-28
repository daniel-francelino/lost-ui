import { FileIcon, XIcon } from "lucide-react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";

export type ChatAttachmentProps = {
  name: string;
  mediaType?: string;
  /** Where the file is. An image with a `url` is shown as a picture. */
  url?: string;
  /** A small chip with the name, or a picture. */
  variant?: "chip" | "thumbnail";
  /** Adds the remove button. */
  onRemove?: () => void;
  className?: string;
};

/** A file attached to a prompt or a message. */
export function ChatAttachment({
  name,
  mediaType,
  url,
  variant = "chip",
  onRemove,
  className,
}: ChatAttachmentProps) {
  const { t } = useLostTranslation();
  const image = Boolean(url) && Boolean(mediaType?.startsWith("image/"));

  const remove = onRemove && (
    <button
      type="button"
      onClick={onRemove}
      aria-label={t("aiChat.removeAttachment", { name })}
      className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-xs transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 [&_svg]:size-3"
    >
      <XIcon aria-hidden="true" />
    </button>
  );

  if (variant === "thumbnail") {
    return (
      <div
        data-slot="chat-attachment"
        data-variant="thumbnail"
        className={cn(
          "relative flex size-16 shrink-0 items-center justify-center rounded-lg border bg-muted",
          className,
        )}
      >
        {image ? (
          <img src={url} alt={name} className="size-full rounded-lg object-cover" />
        ) : (
          <FileIcon aria-hidden="true" className="size-6 text-muted-foreground" />
        )}
        {remove}
      </div>
    );
  }

  return (
    <div
      data-slot="chat-attachment"
      data-variant="chip"
      className={cn(
        "relative flex max-w-48 items-center gap-2 rounded-lg border bg-muted px-2.5 py-1.5 text-sm",
        className,
      )}
    >
      <FileIcon aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{name}</span>
      {remove}
    </div>
  );
}
