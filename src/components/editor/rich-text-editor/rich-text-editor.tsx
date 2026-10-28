import type { Editor } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useImperativeHandle, useMemo, useRef, type Ref } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { EditorBlockHandle } from "../editor-block-handle";
import { EditorBubbleMenu } from "../editor-bubble-menu";
import { createSlashItems, type EditorBlock } from "../editor-slash-menu/slash-items";
import { EditorTableBar } from "../editor-table-bar";
import { createEditorExtensions } from "./extensions";
import { proseClasses } from "./prose";

export type RichTextEditorHandle = {
  focus: () => void;
  /** The content as HTML. */
  getHTML: () => string;
  setContent: (html: string) => void;
  clear: () => void;
  /** The Tiptap editor, for what this component does not do. */
  editor: Editor | null;
};

export type RichTextEditorProps = {
  /** The content as HTML, for a controlled editor. */
  value?: string;
  defaultValue?: string;
  /** Called with the HTML after every change the user makes. */
  onValueChange?: (html: string) => void;
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
  /** Which blocks the `/` menu offers. All of them by default. */
  blocks?: EditorBlock[];
  /** Hides the grip and the plus beside each block. */
  blockHandle?: boolean;
  className?: string;
  ref?: Ref<RichTextEditorHandle>;
};

/**
 * A block editor in the style of Notion: type `/` for blocks, select text for its formatting,
 * drag the grip to move a block. Headings, lists, tasks, quotes, code, tables, images, callouts and
 * toggles. It writes HTML.
 */
export function RichTextEditor({
  value,
  defaultValue = "",
  onValueChange,
  placeholder,
  editable = true,
  minHeight = "8rem",
  surface = "boxed",
  onUploadImage,
  onUploadError,
  blocks,
  blockHandle = true,
  className,
  ref,
}: RichTextEditorProps) {
  const { t } = useLostTranslation();
  const picker = useRef<HTMLInputElement>(null);
  const last = useRef(value ?? defaultValue);
  const onChange = useRef(onValueChange);
  onChange.current = onValueChange;
  const textPlaceholder = placeholder ?? t("editor.placeholder");

  const extensions = useMemo(
    () =>
      createEditorExtensions({
        placeholder: textPlaceholder,
        slashItems: createSlashItems(t, {
          blocks,
          onImage: onUploadImage ? () => picker.current?.click() : undefined,
        }),
      }),
    // the slash items follow the language and the options; `t` changes with the language
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [textPlaceholder, t, blocks, Boolean(onUploadImage)],
  );

  const editor = useEditor(
    {
      extensions,
      content: value ?? defaultValue,
      editable,
      immediatelyRender: false,
      editorProps: {
        attributes: {
          role: "textbox",
          "aria-multiline": "true",
          "aria-label": t("editor.ariaLabel"),
          class: cn(proseClasses, "min-w-0"),
          style: `min-height: ${minHeight}`,
        },
      },
      onUpdate: ({ editor: current }) => {
        last.current = current.getHTML();
        onChange.current?.(last.current);
      },
    },
    [extensions],
  );

  useEffect(() => {
    if (editor && value !== undefined && value !== last.current) {
      last.current = value;
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => void editor?.commands.focus(),
      getHTML: () => editor?.getHTML() ?? "",
      setContent: (html) => void editor?.commands.setContent(html, { emitUpdate: true }),
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
          <EditorBubbleMenu editor={editor} />
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
