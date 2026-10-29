import type { Editor, Range } from "@tiptap/core";
import {
  ChevronRightIcon,
  CodeIcon,
  FileIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  LightbulbIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  MinusIcon,
  QuoteIcon,
  TableIcon,
  TypeIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import type { LostKey } from "../../../i18n";

export const EditorBlock = {
  Paragraph: "paragraph",
  Heading1: "heading1",
  Heading2: "heading2",
  Heading3: "heading3",
  BulletList: "bulletList",
  OrderedList: "orderedList",
  TaskList: "taskList",
  Quote: "quote",
  CodeBlock: "codeBlock",
  Divider: "divider",
  Callout: "callout",
  Toggle: "toggle",
  Table: "table",
  Image: "image",
  File: "file",
} as const;

export type EditorBlock = (typeof EditorBlock)[keyof typeof EditorBlock];

export type SlashItem = {
  id: EditorBlock;
  title: string;
  description: string;
  icon: ReactNode;
  /** More words that find the block, besides its title. */
  keywords: string[];
  run: (context: { editor: Editor; range: Range }) => void;
};

type Translate = (key: LostKey, options?: Record<string, unknown>) => string;

/** What turns the current block into a block of another kind, used by the slash menu and the block menu. */
export const turnInto: Record<EditorBlock, (editor: Editor) => void> = {
  paragraph: (editor) => void editor.chain().focus().setParagraph().run(),
  heading1: (editor) => void editor.chain().focus().setHeading({ level: 1 }).run(),
  heading2: (editor) => void editor.chain().focus().setHeading({ level: 2 }).run(),
  heading3: (editor) => void editor.chain().focus().setHeading({ level: 3 }).run(),
  bulletList: (editor) => void editor.chain().focus().toggleBulletList().run(),
  orderedList: (editor) => void editor.chain().focus().toggleOrderedList().run(),
  taskList: (editor) => void editor.chain().focus().toggleTaskList().run(),
  quote: (editor) => void editor.chain().focus().setBlockquote().run(),
  codeBlock: (editor) => void editor.chain().focus().setCodeBlock().run(),
  divider: (editor) => void editor.chain().focus().setHorizontalRule().run(),
  callout: (editor) => void editor.chain().focus().setCallout().run(),
  toggle: (editor) => void editor.chain().focus().setToggle().run(),
  table: (editor) =>
    void editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  image: () => {},
  file: () => {},
};

const icons: Record<EditorBlock, ReactNode> = {
  paragraph: <TypeIcon />,
  heading1: <Heading1Icon />,
  heading2: <Heading2Icon />,
  heading3: <Heading3Icon />,
  bulletList: <ListIcon />,
  orderedList: <ListOrderedIcon />,
  taskList: <ListTodoIcon />,
  quote: <QuoteIcon />,
  codeBlock: <CodeIcon />,
  divider: <MinusIcon />,
  callout: <LightbulbIcon />,
  toggle: <ChevronRightIcon />,
  table: <TableIcon />,
  image: <ImageIcon />,
  file: <FileIcon />,
};

const keywords: Record<EditorBlock, string[]> = {
  paragraph: ["text", "paragraph", "p"],
  heading1: ["h1", "title", "heading"],
  heading2: ["h2", "subtitle", "heading"],
  heading3: ["h3", "heading"],
  bulletList: ["ul", "bullet", "list"],
  orderedList: ["ol", "number", "list"],
  taskList: ["todo", "task", "check", "list"],
  quote: ["blockquote", "cite"],
  codeBlock: ["pre", "code", "snippet"],
  divider: ["hr", "line", "separator"],
  callout: ["note", "info", "alert"],
  toggle: ["collapse", "details", "expand"],
  table: ["grid", "rows", "columns"],
  image: ["picture", "photo", "upload"],
  file: ["pdf", "document", "attachment", "upload"],
};

/**
 * The blocks of the slash menu. `onImage` and `onFile` are called to pick and upload a file; without
 * them the image and file blocks are left out.
 */
export function createSlashItems(
  t: Translate,
  options: {
    onImage?: ((range: Range) => void) | undefined;
    onFile?: ((range: Range) => void) | undefined;
    blocks?: EditorBlock[] | undefined;
  } = {},
): SlashItem[] {
  const all = Object.values(EditorBlock).filter(
    (id) =>
      (id !== EditorBlock.Image || options.onImage) && (id !== EditorBlock.File || options.onFile),
  );
  const ids = options.blocks ? all.filter((id) => options.blocks?.includes(id)) : all;

  return ids.map((id) => ({
    id,
    title: t(`editor.blocks.${id}.title` as LostKey),
    description: t(`editor.blocks.${id}.description` as LostKey),
    icon: icons[id],
    keywords: keywords[id],
    run: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      if (id === EditorBlock.Image) options.onImage?.(range);
      else if (id === EditorBlock.File) options.onFile?.(range);
      else turnInto[id](editor);
    },
  }));
}

/** The blocks that match what was typed after the slash, by title or by one of their words. */
export function filterSlashItems(items: SlashItem[], query: string): SlashItem[] {
  const text = query.trim().toLowerCase();
  if (text === "") return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(text) ||
      item.keywords.some((word) => word.toLowerCase().startsWith(text)),
  );
}
