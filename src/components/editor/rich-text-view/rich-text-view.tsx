import type { JSONContent } from "@tiptap/core";
import { FileIcon, ImageOffIcon } from "lucide-react";
import { createElement, type CSSProperties, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { proseClasses } from "../rich-text-editor/prose";
import {
  formatFileSize,
  useResolvedUrl,
  type EditorFileAttrs,
  type EditorImageAttrs,
  type ResolveFileHref,
  type ResolveImageSrc,
} from "../rich-text-editor/reference";

export type RichTextViewProps = {
  /** The document the editor writes with `format="json"`. */
  value: JSONContent | null | undefined;
  /** The address to show for an image, like in the editor: the stored one can be an id. */
  resolveImageSrc?: ResolveImageSrc;
  /** The address to open for a file. */
  resolveFileHref?: ResolveFileHref;
  className?: string;
};

type Resolvers = Pick<RichTextViewProps, "resolveImageSrc" | "resolveFileHref">;

const safeHref = /^(https?:|mailto:|tel:|\/|#)/i;
const safeColor = /^(#[0-9a-f]{3,8}|var\(--[\w-]+\)|[a-z]+|(rgb|hsl)a?\([\d\s.,%/-]+\))$/i;
const aligns = ["left", "center", "right", "justify"];

function ViewImage({
  attrs,
  resolve,
}: {
  attrs: EditorImageAttrs;
  resolve: ResolveImageSrc | undefined;
}) {
  const src = useResolvedUrl(attrs, resolve);
  if (!src) {
    return (
      <div
        role="img"
        aria-label={attrs.alt ?? ""}
        className="my-3 flex h-24 items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground"
      >
        <ImageOffIcon aria-hidden="true" className="size-5" />
      </div>
    );
  }
  return <img src={src} alt={attrs.alt ?? ""} title={attrs.title ?? undefined} />;
}

function ViewFile({
  attrs,
  resolve,
}: {
  attrs: EditorFileAttrs;
  resolve: ResolveFileHref | undefined;
}) {
  const { t } = useLostTranslation();
  const href = useResolvedUrl(attrs, resolve);
  const size = typeof attrs.size === "number" ? formatFileSize(attrs.size) : null;
  return (
    <div
      data-type="file"
      className="my-3 flex items-center gap-3 rounded-lg border bg-muted/50 px-3 py-2 text-sm"
    >
      <FileIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate">
        {href && safeHref.test(href) ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("editor.upload.download", { name: attrs.name })}
            className="font-medium"
          >
            {attrs.name}
          </a>
        ) : (
          <span className="font-medium">{attrs.name}</span>
        )}
      </span>
      {size && <span className="shrink-0 text-xs text-muted-foreground">{size}</span>}
    </div>
  );
}

function renderMarks(node: JSONContent, text: ReactNode): ReactNode {
  return (node.marks ?? []).reduce<ReactNode>((inner, mark) => {
    const attrs = mark.attrs ?? {};
    switch (mark.type) {
      case "bold":
        return <strong>{inner}</strong>;
      case "italic":
        return <em>{inner}</em>;
      case "underline":
        return <u>{inner}</u>;
      case "strike":
        return <s>{inner}</s>;
      case "code":
        return <code>{inner}</code>;
      case "highlight":
        return <mark>{inner}</mark>;
      case "link": {
        const href = typeof attrs.href === "string" ? attrs.href : "";
        return safeHref.test(href) ? (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow">
            {inner}
          </a>
        ) : (
          inner
        );
      }
      case "textStyle": {
        const color = typeof attrs.color === "string" ? attrs.color : "";
        return safeColor.test(color) ? <span style={{ color }}>{inner}</span> : inner;
      }
      // a mark the view does not know is dropped; the text stays
      default:
        return inner;
    }
  }, text);
}

function alignOf(node: JSONContent): CSSProperties | undefined {
  const align = node.attrs?.textAlign;
  return typeof align === "string" && aligns.includes(align)
    ? { textAlign: align as "left" }
    : undefined;
}

function renderNode(node: JSONContent, key: number, resolvers: Resolvers): ReactNode {
  const attrs = node.attrs ?? {};
  const children = (): ReactNode[] =>
    (node.content ?? []).map((child, index) => renderNode(child, index, resolvers));

  switch (node.type) {
    case "text":
      return <span key={key}>{renderMarks(node, node.text ?? "")}</span>;
    case "hardBreak":
      return <br key={key} />;
    case "paragraph":
      return (
        <p key={key} style={alignOf(node)}>
          {children()}
        </p>
      );
    case "heading": {
      const level = Math.min(6, Math.max(1, Number(attrs.level) || 1));
      return createElement(`h${level}`, { key, style: alignOf(node) }, children());
    }
    case "bulletList":
      return <ul key={key}>{children()}</ul>;
    case "orderedList":
      return (
        <ol key={key} start={typeof attrs.start === "number" ? attrs.start : undefined}>
          {children()}
        </ol>
      );
    case "listItem":
      return <li key={key}>{children()}</li>;
    case "taskList":
      return (
        <ul key={key} data-type="taskList">
          {children()}
        </ul>
      );
    case "taskItem":
      return (
        <li key={key} data-type="taskItem" data-checked={attrs.checked === true}>
          <label>
            <input type="checkbox" checked={attrs.checked === true} disabled readOnly />
          </label>
          <div>{children()}</div>
        </li>
      );
    case "blockquote":
      return <blockquote key={key}>{children()}</blockquote>;
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{(node.content ?? []).map((child) => child.text ?? "").join("")}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "callout":
      return (
        <div
          key={key}
          data-type="callout"
          data-emoji={typeof attrs.emoji === "string" ? attrs.emoji : "💡"}
        >
          <div>{children()}</div>
        </div>
      );
    case "toggle": {
      const [first, ...rest] = node.content ?? [];
      return (
        <details key={key} data-type="toggle" open={attrs.open !== false}>
          <summary className="cursor-pointer [&>p]:inline">
            {first ? renderNode(first, 0, resolvers) : null}
          </summary>
          {rest.map((child, index) => renderNode(child, index + 1, resolvers))}
        </details>
      );
    }
    case "table":
      return (
        <table key={key}>
          <tbody>{children()}</tbody>
        </table>
      );
    case "tableRow":
      return <tr key={key}>{children()}</tr>;
    case "tableHeader":
    case "tableCell": {
      const cell = node.type === "tableHeader" ? "th" : "td";
      const span = (value: unknown) => (typeof value === "number" && value > 1 ? value : undefined);
      return createElement(
        cell,
        { key, colSpan: span(attrs.colspan), rowSpan: span(attrs.rowspan) },
        children(),
      );
    }
    case "image":
      return typeof attrs.src === "string" ? (
        <ViewImage
          key={key}
          attrs={attrs as EditorImageAttrs}
          resolve={resolvers.resolveImageSrc}
        />
      ) : null;
    case "file":
      return typeof attrs.src === "string" ? (
        <ViewFile key={key} attrs={attrs as EditorFileAttrs} resolve={resolvers.resolveFileHref} />
      ) : null;
    // a node the view does not know is unwrapped: what is inside it stays, the node does not
    default:
      return node.content ? <span key={key}>{children()}</span> : null;
  }
}

/**
 * Shows the JSON of the editor without loading Tiptap: for a page that only reads the text, such as
 * a client portal. It draws what the editor writes, resolves image and file addresses with the same
 * functions, and drops what it does not know (unknown marks, unsafe links and colours).
 */
export function RichTextView({
  value,
  resolveImageSrc,
  resolveFileHref,
  className,
}: RichTextViewProps) {
  return (
    <div data-slot="rich-text-view" className={cn(proseClasses, className)}>
      {(value?.content ?? []).map((node, index) =>
        renderNode(node, index, { resolveImageSrc, resolveFileHref }),
      )}
    </div>
  );
}
