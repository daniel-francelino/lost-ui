import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import { FormField } from "../form-field";
import type { FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type FileRejection = "type" | "size";

export type FormFileUploadProps = FieldProps<File[]> & {
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  dropzoneText?: ReactNode;
  onReject?: (files: File[], reason: FileRejection) => void;
};

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;

  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token);
      if (token.endsWith("/*")) return file.type.toLowerCase().startsWith(token.slice(0, -1));
      return file.type.toLowerCase() === token;
    });
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FormFileUpload(props: FormFileUploadProps) {
  const [fieldProps, { accept, multiple = false, maxSize, dropzoneText, onReject }] =
    splitFieldProps<File[], FormFileUploadProps>(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useField<File[]>(fieldProps, {
    fallback: [],
    focus: () => inputRef.current?.focus(),
  });
  const { controlProps } = field;
  const [dragging, setDragging] = useState(false);
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);

  const accept_ = (incoming: File[]) => {
    const wrongType = incoming.filter((file) => !matchesAccept(file, accept));
    const tooBig = incoming.filter(
      (file) => matchesAccept(file, accept) && maxSize !== undefined && file.size > maxSize,
    );
    if (wrongType.length) onReject?.(wrongType, "type");
    if (tooBig.length) onReject?.(tooBig, "size");

    const valid = incoming.filter((file) => !wrongType.includes(file) && !tooBig.includes(file));
    if (valid.length === 0) return;
    field.setValue(multiple ? [...field.value, ...valid] : valid.slice(0, 1));
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!locked) accept_([...event.dataTransfer.files]);
  };

  return (
    <FormField {...field.shellProps}>
      <label
        htmlFor={controlProps.id}
        data-dragging={dragging ? "" : undefined}
        onDragOver={(event) => {
          event.preventDefault();
          if (!locked) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input p-6 text-center text-sm text-muted-foreground transition-colors hover:bg-accent/40 focus-within:ring-1 focus-within:ring-ring",
          dragging && "border-primary bg-accent/60",
          locked && "cursor-not-allowed opacity-50",
          controlProps["aria-invalid"] && "border-destructive",
        )}
      >
        <UploadIcon className="size-6" aria-hidden="true" />
        <span>{dropzoneText ?? "Drop files here or click to browse"}</span>
        <input
          ref={inputRef}
          {...controlProps}
          type="file"
          name={fieldProps.name}
          accept={accept}
          multiple={multiple}
          disabled={locked}
          className="sr-only"
          onChange={(event) => {
            accept_([...(event.target.files ?? [])]);
            event.target.value = "";
          }}
        />
      </label>
      {field.value.length > 0 && (
        <ul className="mt-2 grid gap-1">
          {field.value.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-md border px-2 py-1.5 text-sm"
            >
              <FileIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-xs text-muted-foreground">{formatSize(file.size)}</span>
              {!locked && (
                <button
                  type="button"
                  aria-label={`Remove ${file.name}`}
                  onClick={() => field.setValue(field.value.filter((_, at) => at !== index))}
                  className="rounded-sm outline-none hover:text-destructive focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </FormField>
  );
}
