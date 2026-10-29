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
| `RichTextView`      | shows the editor JSON without Tiptap, for a page that only reads the text (see "Stored files" below)                                                                    |

Blocks (`EditorBlock`): text, headings 1 to 3, bulleted, numbered and to-do lists, quote, code block, divider, callout, toggle, table, image (only when `onUploadImage` is given) and file (only when `onUploadFile` is given). Texts in en, es and pt (`editor.*` in `src/i18n`).

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
| `bubbleMenu`, `renderBubbleMenu` | turn the toolbar over the selected text off (`false`), pick its tools (`{ tools: ["bold", "italic"] }`), or give your own |
| `allow`                          | the nodes and marks the editor can write at all (see "A closed set" below)                                                |
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

## A closed set of nodes and marks

`blocks` only filters what `/` offers. `allow` removes the extensions themselves, so input rules (`> `, ``````, `---`), pasted HTML, keyboard shortcuts and `setContent` cannot make anything outside the list: a block that is not allowed becomes its text.

```tsx
<RichTextEditor<"json">
  format="json"
  allow={{
    nodes: ["heading", "bulletList", "orderedList", "image"],
    marks: ["bold", "italic"],
  }}
  bubbleMenu={{ tools: ["bold", "italic"] }}
/>
```

- Nodes: `heading`, `bulletList`, `orderedList`, `taskList`, `blockquote`, `codeBlock`, `horizontalRule`, `table`, `image`, `file`, `callout`, `toggle`. The paragraph, the text and the line break are always there; list items, table rows and cells come with their list or table.
- Marks: `bold`, `italic`, `underline`, `strike`, `code`, `link`, `highlight`, `color`.
- A list left out (`nodes` or `marks` missing) means all of them. With `nodes` set, text alignment is off too.
- The `/` menu, the "turn into" menu of the grip and the default tools of the toolbar follow `allow`. `bubbleMenu.tools` can only narrow them.
- The `extensions` of the app are never removed.

## Stored files: images and files that point to an id

For a private bucket the document keeps an id, never a signed address.

| Prop                  | Use                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onUploadImage`       | `(file) => string                                                                                                                                          | { src, attrs? }`: the address, or the address with attributes that stay in the document                                                  |
| `onUploadFile`        | the same for the file block (PDF, documents). Without it the block is left out                                                                             |
| `referenceAttributes` | names of extra attributes of image and file nodes, e.g. `["mediaVersionId"]`. They stay in the JSON as they are and in the HTML as `data-media-version-id` |
| `resolveImageSrc`     | `(attrs) => string                                                                                                                                         | Promise<string>`: the address to show, asked when the image appears, when its attributes change and when the window gets the focus again |
| `resolveFileHref`     | the same for the link of a file                                                                                                                            |
| `maxImages`           | the most images in the text, uploads in progress included. `onMaxImages(max)` is called when files were left out                                           |
| `onUploadError`       | `(error, file)`                                                                                                                                            |

Images and files can be picked (the `/` blocks, several at once), **pasted** and **dropped** on the text; they are uploaded one after the other and each goes where the cursor or the drop was. Until it is done a placeholder shows the upload, and a failed one stays as a placeholder with a "Dismiss" button. The placeholders are not part of the content. Pasted files are ignored when the clipboard also carries text (a sheet, a document): that text is what is pasted.

```tsx
<RichTextEditor<"json">
  format="json"
  referenceAttributes={["mediaVersionId"]}
  onUploadImage={async (file) => {
    const media = await upload(file);
    return { src: media.id, attrs: { mediaVersionId: media.versionId } };
  }}
  resolveImageSrc={(attrs) => signedUrl(String(attrs.mediaVersionId))}
  maxImages={10}
  onMaxImages={() => toast("At most 10 images")}
/>
```

### RichTextView

`RichTextView` draws the same JSON without loading Tiptap (it imports only the types), with the same resolvers:

```tsx
import { RichTextView } from "@danielsoaresf/lost-ui/editor";

<RichTextView value={doc} resolveImageSrc={...} resolveFileHref={...} />;
```

It draws every node the editor writes. A node or mark it does not know is dropped (the text inside a node stays), a link whose address is not `http(s)`, `mailto`, `tel`, relative or `#` is drawn as plain text, and a text colour is kept only if it is a plain colour value or a `var(--token)`.

## Peers

`@tiptap/react`, `@tiptap/core`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/suggestion`, `@tiptap/extension-placeholder`, `@tiptap/extension-highlight`, `@tiptap/extension-text-style` (it brings `Color`), `@tiptap/extension-text-align`, `@tiptap/extension-task-list`, `@tiptap/extension-task-item`, `@tiptap/extension-table`, `@tiptap/extension-image`, `@tiptap/extension-drag-handle-react`. All are optional peers of the package: an app that does not use the editor installs none.

## What kortex has that is not here yet

The editor of kortex is much larger (`NotionStyleEditor.vue` has 3000 lines). Not ported:

- columns (2 and 3) and dragging a block to the side of another to make them;
- wikilinks to other notes, `@` mentions, an emoji menu and link previews;
- the upload panel with a progress bar, retry and cancel (uploads show a placeholder and a failed one can be dismissed);
- code blocks with syntax highlight (a plain code block today);
- attachment bookkeeping (`EditorAttachmentRef`) and the Markdown or JSON output of `utils/editor/content.ts`;
- the hover-follow behaviour of the block handle (Tiptap's own handle is used) and moving a block with the keyboard.

Checked in jsdom only; the layout, the floating toolbars and the drag were not looked at in a real browser.
