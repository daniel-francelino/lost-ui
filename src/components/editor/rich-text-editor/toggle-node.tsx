import { Node, mergeAttributes } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { ChevronRightIcon } from "lucide-react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    toggle: {
      /** Wraps the current block in a toggle that can be collapsed. */
      setToggle: () => ReturnType;
    };
  }
}

function ToggleView({ node, updateAttributes }: NodeViewProps) {
  const { t } = useLostTranslation();
  const open = node.attrs.open !== false;

  return (
    <NodeViewWrapper data-type="toggle" data-open={open} className="flex items-start gap-1">
      <button
        type="button"
        contentEditable={false}
        aria-expanded={open}
        aria-label={open ? t("editor.toggleClose") : t("editor.toggleOpen")}
        onClick={() => updateAttributes({ open: !open })}
        className="mt-1 flex size-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <ChevronRightIcon
          aria-hidden="true"
          className={cn("size-3.5 transition-transform", open && "rotate-90")}
        />
      </button>
      <NodeViewContent
        className={cn("min-w-0 flex-1", !open && "[&>*:not(:first-child)]:hidden")}
      />
    </NodeViewWrapper>
  );
}

/** A block whose first line stays visible and whose other blocks can be hidden. */
export const ToggleNode = Node.create({
  name: "toggle",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      open: {
        default: true,
        parseHTML: (element) => element.getAttribute("data-open") !== "false",
        renderHTML: (attributes) => ({ "data-open": String(attributes.open !== false) }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="toggle"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "toggle" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ToggleView);
  },

  addCommands() {
    return {
      setToggle:
        () =>
        ({ commands }) =>
          commands.wrapIn(this.name),
    };
  },
});
