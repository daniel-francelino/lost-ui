import Image from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { ImageOffIcon } from "lucide-react";

import { referenceAttributes } from "./reference-attributes";
import { useEditorResolvers, useResolvedUrl, type EditorImageAttrs } from "./reference";

function ImageView({ node, selected }: NodeViewProps) {
  const { resolveImageSrc } = useEditorResolvers();
  const attrs = node.attrs as EditorImageAttrs;
  const src = useResolvedUrl(attrs, resolveImageSrc);

  return (
    <NodeViewWrapper data-type="image" data-selected={selected}>
      {src ? (
        <img
          src={src}
          alt={attrs.alt ?? ""}
          title={attrs.title ?? undefined}
          data-drag-handle=""
          draggable={false}
        />
      ) : (
        <div
          role="img"
          aria-label={attrs.alt ?? ""}
          className="my-3 flex h-24 items-center justify-center rounded-lg border border-dashed bg-muted/50 text-muted-foreground"
        >
          <ImageOffIcon aria-hidden="true" className="size-5" />
        </div>
      )}
    </NodeViewWrapper>
  );
}

/**
 * The image block. Besides `src`, `alt` and `title` it keeps the attributes of `referenceAttributes`
 * in the JSON and in the HTML, and shows the address that `resolveImageSrc` gives instead of the stored one.
 */
export function createImageNode(referenceNames: readonly string[]) {
  return Image.extend({
    addAttributes() {
      return { ...this.parent?.(), ...referenceAttributes(referenceNames) };
    },
    addNodeView() {
      return ReactNodeViewRenderer(ImageView);
    },
  });
}
