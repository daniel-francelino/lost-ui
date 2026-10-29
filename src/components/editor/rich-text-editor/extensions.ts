import type { Extensions } from "@tiptap/core";
import { Color } from "@tiptap/extension-text-style";
import { TextStyle } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import { Table, TableCell, TableHeader, TableRow } from "@tiptap/extension-table";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import StarterKit from "@tiptap/starter-kit";

import { SlashCommand } from "../editor-slash-menu/editor-slash-menu";
import type { SlashItem } from "../editor-slash-menu/slash-items";
import { hasMark, hasNode, type EditorAllow } from "./allow";
import { CalloutNode } from "./callout-node";
import { createFileNode } from "./file-node";
import { createImageNode } from "./image-node";
import { ToggleNode } from "./toggle-node";
import { UploadPlaceholders, type UploadLabels } from "./upload";

/**
 * Everything the editor can write: the basics of Tiptap, tasks, tables, images, files, callouts,
 * toggles and the slash menu. `allow` leaves out the nodes and marks that are not in its lists.
 */
export function createEditorExtensions(options: {
  placeholder: string;
  /** Read each time the menu opens, so the blocks can change without a new editor. */
  getSlashItems: () => SlashItem[];
  /** Read when a placeholder is drawn, so the texts follow the language. */
  getUploadLabels?: (() => UploadLabels) | undefined;
  /** Names of extra attributes that image and file nodes keep. */
  referenceAttributes?: readonly string[] | undefined;
  /** Leaves out the nodes and marks that are not listed. */
  allow?: EditorAllow | undefined;
  /** More Tiptap extensions of the app: its own nodes, marks, mentions. */
  extra?: Extensions | undefined;
}): Extensions {
  const { allow } = options;
  const references = options.referenceAttributes ?? [];
  const lists = hasNode(allow, "bulletList") || hasNode(allow, "orderedList");
  const node = (name: Parameters<typeof hasNode>[1]) => hasNode(allow, name);
  const mark = (name: Parameters<typeof hasMark>[1]) => hasMark(allow, name);

  return [
    StarterKit.configure({
      heading: node("heading") ? undefined : false,
      bulletList: node("bulletList") ? undefined : false,
      orderedList: node("orderedList") ? undefined : false,
      listItem: lists ? undefined : false,
      listKeymap: lists ? undefined : false,
      blockquote: node("blockquote") ? undefined : false,
      codeBlock: node("codeBlock") ? undefined : false,
      horizontalRule: node("horizontalRule") ? undefined : false,
      bold: mark("bold") ? undefined : false,
      italic: mark("italic") ? undefined : false,
      underline: mark("underline") ? undefined : false,
      strike: mark("strike") ? undefined : false,
      code: mark("code") ? undefined : false,
      link: mark("link") ? { openOnClick: false, autolink: true } : false,
    }),
    Placeholder.configure({ placeholder: options.placeholder }),
    ...(mark("highlight") ? [Highlight] : []),
    ...(mark("color") ? [TextStyle, Color] : []),
    // alignment has no place in a closed set of nodes
    ...(allow?.nodes ? [] : [TextAlign.configure({ types: ["heading", "paragraph"] })]),
    ...(node("taskList") ? [TaskList, TaskItem.configure({ nested: true })] : []),
    ...(node("table") ? [Table, TableRow, TableHeader, TableCell] : []),
    ...(node("image") ? [createImageNode(references)] : []),
    ...(node("file") ? [createFileNode(references)] : []),
    ...(node("callout") ? [CalloutNode] : []),
    ...(node("toggle") ? [ToggleNode] : []),
    options.getUploadLabels
      ? UploadPlaceholders.configure({ getLabels: options.getUploadLabels })
      : UploadPlaceholders,
    SlashCommand.configure({ getItems: options.getSlashItems }),
    ...(options.extra ?? []),
  ];
}
