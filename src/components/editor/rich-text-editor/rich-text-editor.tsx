import type { Editor, Extensions, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useImperativeHandle, useMemo, useRef, type ReactNode, type Ref } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { EditorBlockHandle } from "../editor-block-handle";
import { EditorBubbleMenu } from "../editor-bubble-menu";
import {
  createSlashItems,
  type EditorBlock,
  type SlashItem,
} from "../editor-slash-menu/slash-items";
import { EditorTableBar } from "../editor-table-bar";
import { createEditorExtensions } from "./extensions";
import { proseClasses } from "./prose";

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
  /** Uploads an image and gives back its URL. Without it the image block is left out. */
  onUploadImage?: (file: File) => Promise<string>;
  /** Called when `onUploadImage` fails. */
  onUploadError?: (error: unknown) => void;
  /** Which of the built-in blocks the `/` menu offers. All of them by default. */
  blocks?: EditorBlock[];
  /** Blocks of your own, added to the `/` menu after the built-in ones. */
  slashItems?: SlashItem[];
  /** More Tiptap extensions: your own nodes and marks, mentions, character count. Keep the array stable (`useMemo`), a new one makes a new editor. */
  extensions?: Extensions;
  /** The toolbar over the selected text. `false` turns it off. */
  bubbleMenu?: boolean;
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
  onUploadError,
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
  const initial = (value ?? defaultValue ?? (asJson ? undefined : "")) as
    string | JSONContent | undefined;
  const last = useRef(keyOf(initial));
  const onChange = useRef(onValueChange);
  onChange.current = onValueChange;
  const ready = useRef(onReady);
  ready.current = onReady;
  const textPlaceholder = placeholder ?? t("editor.placeholder");

  const items = useMemo(
    () => [
      ...createSlashItems(t, {
        blocks,
        onImage: onUploadImage ? () => picker.current?.click() : undefined,
      }),
      ...(slashItems ?? []),
    ],
    [t, blocks, onUploadImage, slashItems],
  );
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const extensions = useMemo(
    () =>
      createEditorExtensions({
        placeholder: textPlaceholder,
        getSlashItems: () => itemsRef.current,
        extra,
      }),
    [textPlaceholder, extra],
  );

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

  const upload = async (file: File | undefined) => {
    if (!file || !onUploadImage || !editor) return;
    try {
      const src = await onUploadImage(file);
      editor.chain().focus().setImage({ src, alt: file.name }).run();
    } catch (error) {
      onUploadError?.(error);
    }
  };

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
      <EditorContent editor={editor} />
      {editable && (
        <>
          {bubbleMenu && (
            <EditorBubbleMenu editor={editor}>
              {editor && renderBubbleMenu?.(editor)}
            </EditorBubbleMenu>
          )}
          <EditorTableBar editor={editor} />
          {blockHandle && <EditorBlockHandle editor={editor} />}
        </>
      )}
      {onUploadImage && (
        <input
          ref={picker}
          type="file"
          accept="image/*"
          hidden
          data-slot="rich-text-editor-image-input"
          onChange={(event) => {
            void upload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      )}
    </div>
  );
}
