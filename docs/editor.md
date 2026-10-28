# Editor (rich text, Notion style)

> **Status: first version implemented and tested in jsdom (2026-10-28).** `@danielsoaresf/lost-ui/editor`, in `src/components/editor/`. Needs the Tiptap peers (below). Not exported from the root entry. Based on the editor of kortex (`kortex-app/app/components/editor/`, Vue). Related: [structure.md](structure.md), [ai-chat.md](ai-chat.md).

`RichTextEditor` is a block editor on [Tiptap 3](https://tiptap.dev): type `/` for blocks, select text for its toolbar, drag the grip beside a block to move it. It writes **HTML** or the Tiptap **JSON** (`format`).

| Piece               | What it does                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `RichTextEditor`    | the editor: `value` / `defaultValue` / `onValueChange` (HTML), `placeholder`, `editable`, `minHeight`, `surface` (`boxed` or `plain`), `blocks`, `onUploadImage`, `ref` |
| `EditorSlashMenu`   | the list of blocks that opens on `/`, filtered as you type, with arrows and Enter (`SlashCommand` is its Tiptap extension)                                              |
| `EditorBubbleMenu`  | the toolbar over selected text: bold, italic, underline, strike, code, highlight, colour, link                                                                          |
| `EditorBlockHandle` | the grip and the plus beside each block: drag, turn into, duplicate, delete, add a block below                                                                          |
| `EditorTableBar`    | the toolbar over a table: add and delete rows and columns, header row, delete the table                                                                                 |

Blocks (`EditorBlock`): text, headings 1 to 3, bulleted, numbered and to-do lists, quote, code block, divider, callout, toggle, table and image (only when `onUploadImage` is given). Texts in en, es and pt (`editor.*` in `src/i18n`).

## Use

```tsx
import { RichTextEditor } from "@danielsoaresf/lost-ui/editor";

<RichTextEditor
  value={html}
  onValueChange={setHtml}
  minHeight="12rem"
  onUploadImage={async (file) => (await upload(file)).url}
/>;
```

The `ref` gives `focus()`, `getHTML()`, `getJSON()`, `getText()`, `setContent(content)`, `clear()` and `editor` (the Tiptap `Editor`, for what is not covered). `surface="plain"` has no frame, for a whole page, and leaves room at the left for the grip.

## Made to fit any use

| Prop                             | Use                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `format`                         | `"html"` (default) or `"json"`: the content comes and goes as a string or as the Tiptap document                          |
| `extensions`                     | your own Tiptap extensions: nodes, marks, mentions, character count (keep the array stable with `useMemo`)                |
| `slashItems`                     | blocks of your own for the `/` menu, after the built-in ones (`SlashItem`: title, description, icon, `run`)               |
| `blocks`                         | which built-in blocks `/` offers                                                                                          |
| `bubbleMenu`, `renderBubbleMenu` | turn the toolbar over the selected text off, or give your own tools for it                                                |
| `blockHandle`                    | hides the grip and the plus                                                                                               |
| `autofocus`                      | `true`, `"start"` or `"end"`                                                                                              |
| `onReady`, `ref`                 | the Tiptap `Editor` once it exists; `ref` gives `focus`, `getHTML`, `getJSON`, `getText`, `setContent`, `clear`, `editor` |
| `editorClassName`, `className`   | classes of the writing area and of the frame                                                                              |

```tsx
<RichTextEditor<"json">
  format="json"
  value={doc}
  onValueChange={setDoc}
  slashItems={myBlocks}
  extensions={myExtensions}
/>
```

## Peers

`@tiptap/react`, `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/suggestion`, `@tiptap/extension-placeholder`, `@tiptap/extension-highlight`, `@tiptap/extension-text-style` (it brings `Color`), `@tiptap/extension-text-align`, `@tiptap/extension-task-list`, `@tiptap/extension-task-item`, `@tiptap/extension-table`, `@tiptap/extension-image`, `@tiptap/extension-drag-handle-react`. All are optional peers of the package: an app that does not use the editor installs none.

## What kortex has that is not here yet

The editor of kortex is much larger (`NotionStyleEditor.vue` has 3000 lines). Not ported:

- columns (2 and 3) and dragging a block to the side of another to make them;
- wikilinks to other notes, `@` mentions, an emoji menu and link previews;
- file blocks and the upload panel with progress, retry and cancel (images upload, with no progress);
- code blocks with syntax highlight (a plain code block today);
- attachment bookkeeping (`EditorAttachmentRef`) and the Markdown or JSON output of `utils/editor/content.ts`;
- the hover-follow behaviour of the block handle (Tiptap's own handle is used) and moving a block with the keyboard.

Checked in jsdom only; the layout, the floating toolbars and the drag were not looked at in a real browser.
