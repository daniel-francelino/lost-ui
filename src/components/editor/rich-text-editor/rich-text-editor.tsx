import type { Editor, Extensions, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useImperativeHandle, useMemo, useRef, type ReactNode, type Ref } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { EditorBlockHandle } from "../editor-block-handle";
import { EditorBubbleMenu, editorBubbleTools, type EditorBubbleTool } from "../editor-bubble-menu";
import {
  createSlashItems,
  type EditorBlock,
  type SlashItem,
} from "../editor-slash-menu/slash-items";
import { EditorTableBar } from "../editor-table-bar";
import { allowedBlocks, hasMark, type EditorAllow, type EditorMarkName } from "./allow";
import { createEditorExtensions } from "./extensions";
import { proseClasses } from "./prose";
import {
  EditorResolversContext,
  type EditorResolvers,
  type EditorUploadResult,
  type ResolveFileHref,
  type ResolveImageSrc,
} from "./reference";
import {
  canUpload,
  uploadFiles,
  type UploadConfig,
  type UploadKind,
  type UploadOptions,
} from "./upload";

/** What the editor reads and writes: `html` (a string) or `json` (the Tiptap document). */
export type EditorFormat = "html" | "json";

export type EditorValue<F extends EditorFormat> = F extends "json" ? JSONContent : string;

export type RichTextEditorHandle = {
  focus: () => void;
  getHTML: () => string;
  getJSON: () => JSONContent;
  /** The plain text, with no formatting. */
  getText: () => string;
  /** Sets the content, as HTML or as a Tiptap document. */
  setContent: (content: string | JSONContent) => void;
  clear: () => void;
  /** The Tiptap editor, for what this component does not do. */
  editor: Editor | null;
};

export type RichTextEditorProps<F extends EditorFormat = "html"> = {
  /** In what shape the content comes and goes: `html` (default) or `json`. */
  format?: F;
  /** The content, for a controlled editor. */
  value?: EditorValue<F>;
  defaultValue?: EditorValue<F>;
  /** Called with the content after every change the user makes. */
  onValueChange?: (value: EditorValue<F>) => void;
  placeholder?: string;
  editable?: boolean;
  /** The least height of the writing area, e.g. `"12rem"`. */
  minHeight?: string;
  /** `boxed` draws a bordered box around the editor; `plain` has no frame, for a whole page. */
  surface?: "boxed" | "plain";
  /**
   * Uploads an image and gives back its URL, or `{ src, attrs }` with attributes that stay in the
   * document (for example an id). Without it the image block is left out, and dropping or pasting
   * images does nothing.
   */
  onUploadImage?: (file: File) => Promise<EditorUploadResult>;
  /** Uploads a file that is not an image (PDF, document). Without it the file block is left out. */
  onUploadFile?: (file: File) => Promise<EditorUploadResult>;
  /** Called when an upload fails. The placeholder stays, with a way to dismiss it. */
  onUploadError?: (error: unknown, file: File) => void;
  /** The most images the text can have, uploads in progress included. */
  maxImages?: number;
  /** Called, with `maxImages`, when images were left out because of the limit. */
  onMaxImages?: (max: number) => void;
  /** Names of extra attributes that image and file nodes keep in the JSON and in the HTML (`data-media-version-id`), e.g. `["mediaVersionId"]`. */
  referenceAttributes?: string[];
  /** The address to show for an image: the stored one can be an id. Asked again when the window gets the focus. */
  resolveImageSrc?: ResolveImageSrc;
  /** The address to open for a file, like `resolveImageSrc`. */
  resolveFileHref?: ResolveFileHref;
  /** The nodes and marks the editor can write. What is left out cannot be made by input rules, paste or shortcuts. */
  allow?: EditorAllow;
  /** Which of the built-in blocks the `/` menu offers. All of them by default. */
  blocks?: EditorBlock[];
  /** Blocks of your own, added to the `/` menu after the built-in ones. */
  slashItems?: SlashItem[];
  /** More Tiptap extensions: your own nodes and marks, mentions, character count. Keep the array stable (`useMemo`), a new one makes a new editor. */
  extensions?: Extensions;
  /** The toolbar over the selected text. `false` turns it off; `{ tools }` picks its tools. */
  bubbleMenu?: boolean | { tools?: EditorBubbleTool[] };
  /** Your own tools for the toolbar over the selected text, instead of the default ones. */
  renderBubbleMenu?: (editor: Editor) => ReactNode;
  /** Hides the grip and the plus beside each block. */
  blockHandle?: boolean;
  /** Puts the cursor in the editor when it opens: `true` where it was, `"start"` or `"end"` of the content. */
  autofocus?: boolean | "start" | "end";
  /** Called once the Tiptap editor exists. */
  onReady?: (editor: Editor) => void;
  className?: string;
  /** Classes of the writing area itself, e.g. a font size. */
  editorClassName?: string;
  ref?: Ref<RichTextEditorHandle>;
};

const keyOf = (value: unknown): string =>
  typeof value === "string" ? value : JSON.stringify(value);

/**
 * A block editor in the style of Notion: type `/` for blocks, select text for its formatting,
 * drag the grip to move a block. Headings, lists, tasks, quotes, code, tables, images, callouts and
 * toggles. It reads and writes HTML or the Tiptap JSON, takes your own Tiptap extensions and
 * slash blocks, and gives you the Tiptap editor for the rest.
 */
export function RichTextEditor<F extends EditorFormat = "html">({
  format,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  editable = true,
  minHeight = "8rem",
  surface = "boxed",
  onUploadImage,
  onUploadFile,
  onUploadError,
  maxImages,
  onMaxImages,
  referenceAttributes,
  resolveImageSrc,
  resolveFileHref,
  allow,
  blocks,
  slashItems,
  extensions: extra,
  bubbleMenu = true,
  renderBubbleMenu,
  blockHandle = true,
  autofocus = false,
  onReady,
  className,
  editorClassName,
  ref,
}: RichTextEditorProps<F>) {
  const { t } = useLostTranslation();
  const asJson = format === "json";
  const picker = useRef<HTMLInputElement>(null);
  const filePicker = useRef<HTMLInputElement>(null);
  const initial = (value ?? defaultValue ?? (asJson ? undefined : "")) as
    string | JSONContent | undefined;
  const last = useRef(keyOf(initial));
  const onChange = useRef(onValueChange);
  onChange.current = onValueChange;
  const ready = useRef(onReady);
  ready.current = onReady;
  const textPlaceholder = placeholder ?? t("editor.placeholder");
  const translate = useRef(t);
  translate.current = t;

  // arrays and objects written inline in the JSX are new on every render: compare what is in them
  const allowKey = allow ? JSON.stringify(allow) : "";
  const referenceKey = referenceAttributes?.join(",") ?? "";
  const shownBlocks = useMemo(() => allowedBlocks(allow, blocks), [allowKey, blocks]);

  const uploadConfig = useRef<UploadConfig>({});
  uploadConfig.current = {
    uploadImage: onUploadImage,
    uploadFile: onUploadFile,
    maxImages,
    onMaxImages,
    onError: onUploadError,
  };
  const editorRef = useRef<Editor | null>(null);

  const items = useMemo(
    () => [
      ...createSlashItems(t, {
        blocks: shownBlocks,
        onImage: onUploadImage ? () => picker.current?.click() : undefined,
        onFile: onUploadFile ? () => filePicker.current?.click() : undefined,
      }),
      ...(slashItems ?? []),
    ],
    [t, shownBlocks, onUploadImage, onUploadFile, slashItems],
  );
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const extensions = useMemo(
    () =>
      createEditorExtensions({
        placeholder: textPlaceholder,
        getSlashItems: () => itemsRef.current,
        getUploadLabels: () => ({
          uploading: (name) => translate.current("editor.upload.uploading", { name }),
          failed: (name) => translate.current("editor.upload.failed", { name }),
          dismiss: translate.current("editor.upload.dismiss"),
        }),
        referenceAttributes: referenceKey ? referenceKey.split(",") : undefined,
        allow: allowKey ? (JSON.parse(allowKey) as EditorAllow) : undefined,
        extra,
      }),
    [textPlaceholder, extra, allowKey, referenceKey],
  );

  const startUpload = (files: File[], options: UploadOptions = {}) => {
    const current = editorRef.current;
    if (!current || !current.isEditable || !canUpload(files, uploadConfig.current)) return false;
    void uploadFiles(current, files, uploadConfig.current, options);
    return true;
  };
  const startUploadRef = useRef(startUpload);
  startUploadRef.current = startUpload;

  const editor = useEditor(
    {
      extensions,
      content: initial,
      editable,
      autofocus: autofocus === true ? false : autofocus,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          role: "textbox",
          "aria-multiline": "true",
          "aria-label": t("editor.ariaLabel"),
          class: cn(proseClasses, "min-w-0", editorClassName),
          style: `min-height: ${minHeight}`,
        },
        handlePaste: (_view, event) => {
          const data = event.clipboardData;
          // text that comes with the files (a sheet, a document) is the content to paste, not the files
          if (!data || data.getData("text/plain") !== "") return false;
          return startUploadRef.current(Array.from(data.files));
        },
        handleDrop: (view, event, _slice, moved) => {
          const files = Array.from(event.dataTransfer?.files ?? []);
          if (moved || files.length === 0) return false;
          const at = view.posAtCoords({ left: event.clientX, top: event.clientY })?.pos;
          return startUploadRef.current(files, { at });
        },
      },
      onUpdate: ({ editor: current }) => {
        const next = asJson ? current.getJSON() : current.getHTML();
        last.current = keyOf(next);
        onChange.current?.(next as EditorValue<F>);
      },
    },
    [extensions],
  );

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (editor && value !== undefined && keyOf(value) !== last.current) {
      last.current = keyOf(value);
      editor.commands.setContent(value as string | JSONContent, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(editable, false);
  }, [editor, editable]);

  useEffect(() => {
    if (editor && autofocus === true) editor.commands.focus();
  }, [editor, autofocus]);

  useEffect(() => {
    if (editor) ready.current?.(editor);
  }, [editor]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => void editor?.commands.focus(),
      getHTML: () => editor?.getHTML() ?? "",
      getJSON: () => editor?.getJSON() ?? { type: "doc", content: [] },
      getText: () => editor?.getText() ?? "",
      setContent: (content) => void editor?.commands.setContent(content, { emitUpdate: true }),
      clear: () => void editor?.commands.clearContent(true),
      editor,
    }),
    [editor],
  );

  const resolvers = useMemo<EditorResolvers>(
    () => ({ resolveImageSrc, resolveFileHref }),
    [resolveImageSrc, resolveFileHref],
  );

  const pick = (files: FileList | null, as: UploadKind) => {
    if (editor && files && files.length > 0)
      void uploadFiles(editor, Array.from(files), uploadConfig.current, { as, focus: true });
  };

  // the toolbar offers only the tools the schema has
  const bubbleTools = useMemo(() => {
    const wanted = typeof bubbleMenu === "object" ? bubbleMenu.tools : undefined;
    const marks = (tool: EditorBubbleTool): EditorMarkName =>
      tool === "highlight" ? "highlight" : tool === "color" ? "color" : tool;
    return (wanted ?? editorBubbleTools).filter((tool) => hasMark(allow, marks(tool)));
  }, [bubbleMenu, allowKey]);

  return (
    <div
      data-slot="rich-text-editor"
      data-surface={surface}
      className={cn(
        "relative",
        surface === "boxed" &&
          "rounded-xl border bg-background px-4 py-3 shadow-xs transition-colors focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/30",
        surface === "plain" && editable && "pl-10",
        className,
      )}
    >
      <EditorResolversContext.Provider value={resolvers}>
        <EditorContent editor={editor} />
      </EditorResolversContext.Provider>
      {editable && (
        <>
          {bubbleMenu && (
            <EditorBubbleMenu editor={editor} tools={bubbleTools}>
              {editor && renderBubbleMenu?.(editor)}
            </EditorBubbleMenu>
          )}
          <EditorTableBar editor={editor} />
          {blockHandle && <EditorBlockHandle editor={editor} blocks={shownBlocks} />}
        </>
      )}
      {onUploadImage && (
        <input
          ref={picker}
          type="file"
          accept="image/*"
          multiple
          hidden
          data-slot="rich-text-editor-image-input"
          onChange={(event) => {
            pick(event.target.files, "image");
            event.target.value = "";
          }}
        />
      )}
      {onUploadFile && (
        <input
          ref={filePicker}
          type="file"
          multiple
          hidden
          data-slot="rich-text-editor-file-input"
          onChange={(event) => {
            pick(event.target.files, "file");
            event.target.value = "";
          }}
        />
      )}
    </div>
  );
}
