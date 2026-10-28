import type { Extensions } from "@tiptap/core";
import { Color } from "@tiptap/extension-text-style";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";

import { SlashCommand } from "../editor-slash-menu/editor-slash-menu";
import type { SlashItem } from "../editor-slash-menu/slash-items";
import { CalloutNode } from "./callout-node";
import { ToggleNode } from "./toggle-node";

/** Everything the editor can write: the basics of Tiptap, tasks, tables, images, callouts, toggles and the slash menu. */
export function createEditorExtensions(options: {
  placeholder: string;
  slashItems: SlashItem[];
}): Extensions {
  return [
    StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
    Placeholder.configure({ placeholder: options.placeholder }),
    Highlight,
    TextStyle,
    Color,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Table,
    TableRow,
    TableHeader,
    TableCell,
    Image,
    CalloutNode,
    ToggleNode,
    SlashCommand.configure({ items: options.slashItems }),
  ];
}
