import { Editor } from "@tiptap/core";
import { describe, expect, it, vi } from "vitest";

import { translate } from "../../../i18n";
import { createEditorExtensions } from "../rich-text-editor/extensions";
import { createSlashItems, EditorBlock, filterSlashItems, turnInto } from "./slash-items";

const items = createSlashItems(translate, { onImage: () => {} });

function editorWith(html: string) {
  return new Editor({
    element: document.createElement("div"),
    extensions: createEditorExtensions({ placeholder: "", slashItems: [] }),
    content: html,
  });
}

describe("slash items", () => {
  it("has a title, a description and an icon for every block", () => {
    expect(items.map((item) => item.id)).toEqual(Object.values(EditorBlock));
    for (const item of items) {
      expect(item.title).not.toBe("");
      expect(item.description).not.toBe("");
      expect(item.icon).toBeTruthy();
    }
  });

  it("leaves the image block out when nothing can upload", () => {
    expect(createSlashItems(translate).map((item) => item.id)).not.toContain("image");
  });

  it("keeps only the blocks it is told to, in their order", () => {
    const some = createSlashItems(translate, { blocks: ["heading1", "quote"] });
    expect(some.map((item) => item.id)).toEqual(["heading1", "quote"]);
  });

  it("finds a block by its title or by a word that starts one of its keywords", () => {
    expect(filterSlashItems(items, "head").map((item) => item.id)).toEqual([
      "heading1",
      "heading2",
      "heading3",
    ]);
    expect(filterSlashItems(items, "h2").map((item) => item.id)).toEqual(["heading2"]);
    expect(filterSlashItems(items, "TODO").map((item) => item.id)).toEqual(["taskList"]);
    expect(filterSlashItems(items, "zzz")).toEqual([]);
    expect(filterSlashItems(items, "  ")).toHaveLength(items.length);
  });

  it("translates the titles", async () => {
    const { lostI18n } = await import("../../../i18n");
    await lostI18n.changeLanguage("pt");
    expect(createSlashItems(translate)[0]?.title).toBe("Texto");
    await lostI18n.changeLanguage("en");
  });

  it("calls onImage after it removes the slash text", () => {
    const onImage = vi.fn();
    const editor = editorWith("<p>/imag</p>");
    const image = createSlashItems(translate, { onImage }).find((item) => item.id === "image")!;
    image.run({ editor, range: { from: 1, to: 6 } });
    expect(editor.getHTML()).toBe("<p></p>");
    expect(onImage).toHaveBeenCalledOnce();
  });
});

describe("turnInto", () => {
  it.each([
    ["heading1", "<h1>Text</h1>"],
    ["heading2", "<h2>Text</h2>"],
    ["heading3", "<h3>Text</h3>"],
    ["bulletList", "<ul><li><p>Text</p></li></ul>"],
    ["orderedList", "<ol><li><p>Text</p></li></ol>"],
    ["quote", "<blockquote><p>Text</p></blockquote>"],
    ["codeBlock", "<pre><code>Text</code></pre>"],
  ] as const)("turns a paragraph into %s", (block, html) => {
    const editor = editorWith("<p>Text</p>");
    editor.commands.setTextSelection(2);
    turnInto[block](editor);
    // the editor always keeps an empty paragraph after the last block
    expect(editor.getHTML()).toContain(html);
  });

  it("makes a task list, a callout and a toggle around the block", () => {
    const task = editorWith("<p>Text</p>");
    task.commands.setTextSelection(2);
    turnInto.taskList(task);
    expect(task.getHTML()).toContain('data-type="taskList"');

    const callout = editorWith("<p>Text</p>");
    callout.commands.setTextSelection(2);
    turnInto.callout(callout);
    expect(callout.getHTML()).toContain('data-type="callout"');
    expect(callout.getHTML()).toContain('data-emoji="💡"');

    const toggle = editorWith("<p>Text</p>");
    toggle.commands.setTextSelection(2);
    turnInto.toggle(toggle);
    expect(toggle.getHTML()).toContain('data-type="toggle"');
  });

  it("inserts a divider and a table", () => {
    const divider = editorWith("<p>Text</p>");
    divider.commands.setTextSelection(2);
    turnInto.divider(divider);
    expect(divider.getHTML()).toContain("<hr>");

    const table = editorWith("<p>Text</p>");
    table.commands.setTextSelection(2);
    turnInto.table(table);
    expect(table.view.dom.querySelectorAll("tr")).toHaveLength(3);
    expect(table.view.dom.querySelectorAll("th")).toHaveLength(3);
  });
});
