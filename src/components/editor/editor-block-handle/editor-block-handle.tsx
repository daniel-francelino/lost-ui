import type { Editor } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { DragHandle } from "@tiptap/extension-drag-handle-react";
import { CopyIcon, GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useRef } from "react";

import type { LostKey } from "../../../i18n";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { EditorBlock, turnInto } from "../editor-slash-menu/slash-items";

export type EditorBlockHandleProps = {
  editor: Editor | null;
  /** The blocks the block can be turned into. All the text blocks by default. */
  blocks?: readonly EditorBlock[] | undefined;
};

const turnIntoBlocks = [
  EditorBlock.Paragraph,
  EditorBlock.Heading1,
  EditorBlock.Heading2,
  EditorBlock.Heading3,
  EditorBlock.BulletList,
  EditorBlock.OrderedList,
  EditorBlock.TaskList,
  EditorBlock.Quote,
  EditorBlock.CodeBlock,
] as const;

/**
 * The grip beside each block: drag it to move the block, click it for the menu (turn into,
 * duplicate, delete), and the plus beside it adds a block below.
 */
export function EditorBlockHandle({ editor, blocks }: EditorBlockHandleProps) {
  const { t } = useLostTranslation();
  const current = useRef<{ node: ProseMirrorNode | null; pos: number }>({ node: null, pos: -1 });

  if (!editor || !editor.isEditable) return null;

  const select = () => {
    if (current.current.pos >= 0)
      editor.chain().focus().setNodeSelection(current.current.pos).run();
  };

  const duplicate = () => {
    const { node, pos } = current.current;
    if (node)
      editor
        .chain()
        .focus()
        .insertContentAt(pos + node.nodeSize, node.toJSON())
        .run();
  };

  const remove = () => {
    const { node, pos } = current.current;
    if (node)
      editor
        .chain()
        .focus()
        .deleteRange({ from: pos, to: pos + node.nodeSize })
        .run();
  };

  const addBelow = () => {
    const { node, pos } = current.current;
    if (!node) return;
    const at = pos + node.nodeSize;
    editor
      .chain()
      .focus()
      .insertContentAt(at, { type: "paragraph", content: [{ type: "text", text: "/" }] })
      .setTextSelection(at + 2)
      .run();
  };

  return (
    <DragHandle
      editor={editor}
      onNodeChange={({ node, pos }) => {
        current.current = { node, pos };
      }}
    >
      <div data-slot="editor-block-handle" className="flex items-center gap-0.5 pr-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("editor.handle.add")}
          title={t("editor.handle.add")}
          onClick={addBelow}
          className="size-6 text-muted-foreground [&_svg]:size-4"
        >
          <PlusIcon aria-hidden="true" />
        </Button>
        <DropdownMenu onOpenChange={(open) => open && select()}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("editor.handle.menu")}
              title={t("editor.handle.drag")}
              className="size-6 cursor-grab text-muted-foreground [&_svg]:size-4"
            >
              <GripVerticalIcon aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {t("editor.handle.turnInto")}
            </DropdownMenuLabel>
            {turnIntoBlocks
              .filter((id) => !blocks || blocks.includes(id))
              .map((id) => (
                <DropdownMenuItem key={id} onSelect={() => turnInto[id](editor)}>
                  {t(`editor.blocks.${id}.title` as LostKey)}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={duplicate}>
              <CopyIcon aria-hidden="true" />
              {t("editor.handle.duplicate")}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={remove} className="text-destructive focus:text-destructive">
              <Trash2Icon aria-hidden="true" />
              {t("editor.handle.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </DragHandle>
  );
}
