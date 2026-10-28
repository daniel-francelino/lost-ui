import { PaperclipIcon } from "lucide-react";
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "../../../lib/cn";
import { useControlled } from "../../../lib/use-controlled";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { ChatAttachment } from "../chat-attachment";
import { ChatPromptSubmit } from "../chat-prompt-submit";
import type { ChatStatus } from "../chat-parts/types";

export type ChatPromptProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the text and the files when the user sends. Empty text without files is not sent. */
  onSubmit?: (value: string, files: File[]) => void;
  /** While `submitted` or `streaming` a second send is ignored and the button stops the answer. */
  status?: ChatStatus;
  onStop?: () => void;
  onReload?: () => void;
  placeholder?: string;
  /** `Enter` sends and `Shift+Enter` breaks the line. With `false`, `Ctrl/Cmd+Enter` sends. */
  submitOnEnter?: boolean;
  /** The textarea grows with the text up to this many lines. */
  maxRows?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  /** Adds the paperclip, and takes files pasted or dropped on the prompt. */
  attachments?: boolean;
  /** The types the file picker, the paste and the drop take, e.g. `"image/*,application/pdf"`. */
  accept?: string;
  multiple?: boolean;
  files?: File[];
  onFilesChange?: (files: File[]) => void;
  variant?: "outline" | "soft" | "naked";
  /** Above the textarea, e.g. a quote of the message being answered. */
  header?: ReactNode;
  /** In the row under the textarea, beside the buttons: a model picker, tools. */
  footer?: ReactNode;
  /** Replaces the send button. */
  submit?: ReactNode;
  /** `Esc` was pressed in the textarea. */
  onClose?: () => void;
  className?: string;
};

const variants = {
  outline: "border bg-background shadow-xs",
  soft: "border border-transparent bg-muted",
  naked: "border border-transparent bg-transparent",
} as const;

/**
 * The box where the user writes to the assistant: a textarea that grows, send on `Enter`, files,
 * and the button that sends, stops or retries according to `status`.
 */
export function ChatPrompt({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onSubmit,
  status = "ready",
  onStop,
  onReload,
  placeholder,
  submitOnEnter = true,
  maxRows = 8,
  autoFocus = false,
  disabled = false,
  attachments = false,
  accept,
  multiple = true,
  files: filesProp,
  onFilesChange,
  variant = "outline",
  header,
  footer,
  submit,
  onClose,
  className,
}: ChatPromptProps) {
  const { t } = useLostTranslation();
  const textareaId = useId();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const picker = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [valueState, setValue] = useControlled<string>({
    value: valueProp,
    defaultValue,
    onValueChange,
  });
  const [filesState, setFiles] = useControlled<File[]>({
    value: filesProp,
    defaultValue: [],
    onValueChange: onFilesChange,
  });
  const value = valueState ?? "";
  const files = filesState ?? [];
  const busy = status === "submitted" || status === "streaming";

  useLayoutEffect(() => {
    const element = textarea.current;
    if (!element) return;
    const line = Number.parseFloat(getComputedStyle(element).lineHeight) || 20;
    element.style.height = "auto";
    element.style.height = `${Math.min(element.scrollHeight, line * maxRows)}px`;
  }, [value, maxRows]);

  const send = () => {
    if (busy || disabled) return;
    if (value.trim() === "" && files.length === 0) return;
    onSubmit?.(value.trim(), files);
    setValue("");
    setFiles([]);
  };

  const addFiles = (list: FileList | File[] | null) => {
    if (!list || !attachments) return;
    const accepted = [...list].filter((file) => matches(file, accept));
    if (accepted.length === 0) return;
    setFiles(multiple ? [...files, ...accepted] : accepted.slice(0, 1));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Escape") {
      event.currentTarget.blur();
      onClose?.();
      return;
    }
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    const modifier = event.ctrlKey || event.metaKey;
    if ((submitOnEnter && !event.shiftKey) || (!submitOnEnter && modifier)) {
      event.preventDefault();
      send();
    }
  };

  const onPaste = (event: ClipboardEvent<HTMLTextAreaElement>) => {
    if (event.clipboardData.files.length === 0) return;
    event.preventDefault();
    addFiles(event.clipboardData.files);
  };

  const onDrop = (event: DragEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <form
      data-slot="chat-prompt"
      data-dragging={dragging ? "" : undefined}
      onSubmit={(event: FormEvent) => {
        event.preventDefault();
        send();
      }}
      onDragOver={(event) => {
        if (!attachments) return;
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex w-full flex-col gap-2 rounded-2xl p-2 transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
        variants[variant],
        dragging && "border-ring bg-accent",
        disabled && "opacity-60",
        className,
      )}
    >
      {header}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-1 pt-1">
          {files.map((file, index) => (
            <ChatAttachment
              key={`${file.name}-${index}`}
              name={file.name}
              mediaType={file.type}
              onRemove={() => setFiles(files.filter((_, at) => at !== index))}
            />
          ))}
        </div>
      )}
      <label htmlFor={textareaId} className="sr-only">
        {placeholder ?? t("aiChat.placeholder")}
      </label>
      <textarea
        id={textareaId}
        ref={textarea}
        rows={1}
        value={value}
        autoFocus={autoFocus}
        disabled={disabled}
        placeholder={placeholder ?? t("aiChat.placeholder")}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={onKeyDown}
        onPaste={onPaste}
        className="max-h-none w-full resize-none bg-transparent px-2 py-1.5 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
      />
      <div className="flex items-center gap-2">
        {attachments && (
          <>
            <input
              ref={picker}
              type="file"
              hidden
              multiple={multiple}
              accept={accept}
              onChange={(event) => {
                addFiles(event.target.files);
                event.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label={t("aiChat.attach")}
              onClick={() => picker.current?.click()}
            >
              <PaperclipIcon aria-hidden="true" />
            </Button>
          </>
        )}
        <div className="flex min-w-0 flex-1 items-center gap-2">{footer}</div>
        {submit ?? (
          <ChatPromptSubmit
            status={status}
            onStop={onStop}
            onReload={onReload}
            disabled={
              status === "ready" && (disabled || (value.trim() === "" && files.length === 0))
            }
          />
        )}
      </div>
    </form>
  );
}

/** Does the file match an `accept` string such as `"image/*,.pdf,application/pdf"`? */
function matches(file: File, accept: string | undefined): boolean {
  if (!accept || accept.trim() === "" || accept.trim() === "*") return true;
  return accept.split(",").some((rule) => {
    const token = rule.trim().toLowerCase();
    if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token);
    if (token.endsWith("/*")) return file.type.toLowerCase().startsWith(token.slice(0, -1));
    return file.type.toLowerCase() === token;
  });
}
