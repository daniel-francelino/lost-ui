import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  ArrowDownToLineIcon,
  ArrowLeftToLineIcon,
  ArrowRightToLineIcon,
  ArrowUpToLineIcon,
  PanelTopIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";

export type EditorTableBarProps = { editor: Editor | null };

/** The toolbar that floats over a table while the cursor is in it: add and delete rows and columns. */
export function EditorTableBar({ editor }: EditorTableBarProps) {
  const { t } = useLostTranslation();
  if (!editor) return null;

  const actions: { label: string; icon: LucideIcon; run: () => void; destructive?: boolean }[] = [
    {
      label: t("editor.table.addRowBefore"),
      icon: ArrowUpToLineIcon,
      run: () => void editor.chain().focus().addRowBefore().run(),
    },
    {
      label: t("editor.table.addRowAfter"),
      icon: ArrowDownToLineIcon,
      run: () => void editor.chain().focus().addRowAfter().run(),
    },
    {
      label: t("editor.table.deleteRow"),
      icon: Trash2Icon,
      destructive: true,
      run: () => void editor.chain().focus().deleteRow().run(),
    },
    {
      label: t("editor.table.addColumnBefore"),
      icon: ArrowLeftToLineIcon,
      run: () => void editor.chain().focus().addColumnBefore().run(),
    },
    {
      label: t("editor.table.addColumnAfter"),
      icon: ArrowRightToLineIcon,
      run: () => void editor.chain().focus().addColumnAfter().run(),
    },
    {
      label: t("editor.table.deleteColumn"),
      icon: Trash2Icon,
      destructive: true,
      run: () => void editor.chain().focus().deleteColumn().run(),
    },
    {
      label: t("editor.table.toggleHeader"),
      icon: PanelTopIcon,
      run: () => void editor.chain().focus().toggleHeaderRow().run(),
    },
    {
      label: t("editor.table.deleteTable"),
      icon: Trash2Icon,
      destructive: true,
      run: () => void editor.chain().focus().deleteTable().run(),
    },
  ];

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="editorTableBar"
      options={{ placement: "bottom-start", offset: 8 }}
      shouldShow={({ editor: current }) => current.isEditable && current.isActive("table")}
    >
      <div
        data-slot="editor-table-bar"
        role="toolbar"
        aria-label={t("editor.table.label")}
        className="flex items-center gap-0.5 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
      >
        {actions.map(({ label, icon: Icon, run, destructive }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="icon"
            aria-label={label}
            title={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={run}
            className={`size-8 [&_svg]:size-4 ${destructive ? "text-destructive" : ""}`}
          >
            <Icon aria-hidden="true" />
          </Button>
        ))}
      </div>
    </BubbleMenu>
  );
}
