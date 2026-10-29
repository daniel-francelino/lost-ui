import { EditorBlock } from "../editor-slash-menu/slash-items";

/** The nodes the editor can have besides the paragraph, the text and the line break, which are always there. */
export type EditorNodeName =
  | "heading"
  | "bulletList"
  | "orderedList"
  | "taskList"
  | "blockquote"
  | "codeBlock"
  | "horizontalRule"
  | "table"
  | "image"
  | "file"
  | "callout"
  | "toggle";

export type EditorMarkName =
  "bold" | "italic" | "underline" | "strike" | "code" | "link" | "highlight" | "color";

/**
 * What the editor can write. A name left out of the list is not in the schema: input rules, pasted
 * HTML, keyboard shortcuts and `setContent` cannot make it. `nodes` or `marks` left undefined
 * means all of them. Nodes and marks of the `extensions` prop are never removed.
 */
export type EditorAllow = {
  nodes?: readonly EditorNodeName[];
  marks?: readonly EditorMarkName[];
};

export const editorNodeNames: readonly EditorNodeName[] = [
  "heading",
  "bulletList",
  "orderedList",
  "taskList",
  "blockquote",
  "codeBlock",
  "horizontalRule",
  "table",
  "image",
  "file",
  "callout",
  "toggle",
];

export const editorMarkNames: readonly EditorMarkName[] = [
  "bold",
  "italic",
  "underline",
  "strike",
  "code",
  "link",
  "highlight",
  "color",
];

/** The node that each block of the `/` menu makes (`null`: the paragraph, always there). */
const blockNode: Record<EditorBlock, EditorNodeName | null> = {
  paragraph: null,
  heading1: "heading",
  heading2: "heading",
  heading3: "heading",
  bulletList: "bulletList",
  orderedList: "orderedList",
  taskList: "taskList",
  quote: "blockquote",
  codeBlock: "codeBlock",
  divider: "horizontalRule",
  callout: "callout",
  toggle: "toggle",
  table: "table",
  image: "image",
  file: "file",
};

export const hasNode = (allow: EditorAllow | undefined, name: EditorNodeName) =>
  !allow?.nodes || allow.nodes.includes(name);

export const hasMark = (allow: EditorAllow | undefined, name: EditorMarkName) =>
  !allow?.marks || allow.marks.includes(name);

/** The blocks of the `/` menu (or the turn-into menu) that `allow` leaves in, out of the ones asked for. */
export function allowedBlocks(
  allow: EditorAllow | undefined,
  blocks?: EditorBlock[],
): EditorBlock[] | undefined {
  if (!allow?.nodes) return blocks;
  const kept = Object.values(EditorBlock).filter((id) => {
    const node = blockNode[id];
    return node === null || hasNode(allow, node);
  });
  return blocks ? kept.filter((id) => blocks.includes(id)) : kept;
}
