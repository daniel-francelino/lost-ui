import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { FileIcon } from "lucide-react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { referenceAttributes } from "./reference-attributes";
import {
  formatFileSize,
  useEditorResolvers,
  useResolvedUrl,
  type EditorFileAttrs,
} from "./reference";

function FileView({ node, selected }: NodeViewProps) {
  const { t } = useLostTranslation();
  const { resolveFileHref } = useEditorResolvers();
  const attrs = node.attrs as EditorFileAttrs;
  const href = useResolvedUrl(attrs, resolveFileHref);
  const size = typeof attrs.size === "number" ? formatFileSize(attrs.size) : null;

  return (
    <NodeViewWrapper
      data-type="file"
      data-selected={selected}
      className="my-3 flex items-center gap-3 rounded-lg border bg-muted/50 px-3 py-2 text-sm"
    >
      <FileIcon aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1 truncate">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("editor.upload.download", { name: attrs.name })}
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            {attrs.name}
          </a>
        ) : (
          <span className="font-medium">{attrs.name}</span>
        )}
      </span>
      {size && <span className="shrink-0 text-xs text-muted-foreground">{size}</span>}
    </NodeViewWrapper>
  );
}

/** Builds the file block: a document that is not an image (PDF, text, sheet), shown as a card with its name and size. */
export function createFileNode(referenceNames: readonly string[]) {
  return Node.create({
    name: "file",
    group: "block",
    atom: true,
    draggable: true,

    addAttributes() {
      return {
        src: {
          default: "",
          rendered: false,
          parseHTML: (element) => element.getAttribute("data-src") ?? "",
        },
        name: {
          default: "",
          rendered: false,
          parseHTML: (element) => element.getAttribute("data-name") ?? "",
        },
        size: {
          default: null,
          rendered: false,
          parseHTML: (element) => {
            const size = Number(element.getAttribute("data-size"));
            return Number.isFinite(size) && element.hasAttribute("data-size") ? size : null;
          },
        },
        mimeType: {
          default: null,
          rendered: false,
          parseHTML: (element) => element.getAttribute("data-mime-type"),
        },
        ...referenceAttributes(referenceNames),
      };
    },

    parseHTML() {
      return [{ tag: 'div[data-type="file"]' }];
    },

    renderHTML({ node, HTMLAttributes }) {
      const { src, name, size, mimeType } = node.attrs as EditorFileAttrs;
      const attributes = mergeAttributes(
        HTMLAttributes,
        { "data-type": "file", "data-src": src, "data-name": name },
        size === null || size === undefined ? {} : { "data-size": String(size) },
        mimeType ? { "data-mime-type": mimeType } : {},
      );
      return ["div", attributes, ["a", { href: src }, name]];
    },

    addNodeView() {
      return ReactNodeViewRenderer(FileView);
    },
  });
}
