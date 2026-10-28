import type { Editor } from "@tiptap/core";
import { useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  BoldIcon,
  CheckIcon,
  CodeIcon,
  HighlighterIcon,
  ItalicIcon,
  LinkIcon,
  PaletteIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UnlinkIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import type { LostKey } from "../../../i18n";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

export type EditorBubbleMenuProps = { editor: Editor | null };

const colors = [
  { key: "colorDefault", value: null },
  { key: "colorRed", value: "var(--destructive)" },
  { key: "colorOrange", value: "var(--warning)" },
  { key: "colorGreen", value: "var(--success)" },
  { key: "colorBlue", value: "var(--info)" },
  { key: "colorPurple", value: "var(--primary)" },
] as const;

function Tool({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn("size-8 [&_svg]:size-4", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );
}

/** The toolbar that floats over the selected text: bold, italic, underline, strike, code, highlight, colour, link. */
export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const { t } = useLostTranslation();
  const [linking, setLinking] = useState(false);
  const [url, setUrl] = useState("");

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      underline: current?.isActive("underline") ?? false,
      strike: current?.isActive("strike") ?? false,
      code: current?.isActive("code") ?? false,
      highlight: current?.isActive("highlight") ?? false,
      link: current?.isActive("link") ?? false,
      href: (current?.getAttributes("link").href as string | undefined) ?? "",
    }),
  });

  if (!editor || !state) return null;

  const applyLink = () => {
    const href = url.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (href === "") chain.unsetLink().run();
    else chain.setLink({ href }).run();
    setLinking(false);
  };

  return (
    <BubbleMenu
      editor={editor}
      pluginKey="editorBubbleMenu"
      options={{ placement: "top", offset: 8 }}
      shouldShow={({ editor: current, from, to }) =>
        current.isEditable &&
        from !== to &&
        !current.isActive("codeBlock") &&
        !current.isActive("image")
      }
    >
      <div
        data-slot="editor-bubble-menu"
        role="toolbar"
        aria-label={t("editor.bubble.label")}
        className="flex items-center gap-0.5 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
      >
        {linking ? (
          <form
            className="flex items-center gap-1"
            onSubmit={(event) => {
              event.preventDefault();
              applyLink();
            }}
          >
            <input
              autoFocus
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder={t("editor.bubble.linkPlaceholder")}
              aria-label={t("editor.bubble.linkPlaceholder")}
              className="h-8 w-56 rounded-md border bg-background px-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
            <Tool label={t("editor.bubble.applyLink")} onClick={applyLink}>
              <CheckIcon />
            </Tool>
          </form>
        ) : (
          <>
            <Tool
              label={t("editor.bubble.bold")}
              active={state.bold}
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <BoldIcon />
            </Tool>
            <Tool
              label={t("editor.bubble.italic")}
              active={state.italic}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <ItalicIcon />
            </Tool>
            <Tool
              label={t("editor.bubble.underline")}
              active={state.underline}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon />
            </Tool>
            <Tool
              label={t("editor.bubble.strike")}
              active={state.strike}
              onClick={() => editor.chain().focus().toggleStrike().run()}
            >
              <StrikethroughIcon />
            </Tool>
            <Tool
              label={t("editor.bubble.code")}
              active={state.code}
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <CodeIcon />
            </Tool>
            <Tool
              label={t("editor.bubble.highlight")}
              active={state.highlight}
              onClick={() => editor.chain().focus().toggleHighlight().run()}
            >
              <HighlighterIcon />
            </Tool>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t("editor.bubble.textColor")}
                  title={t("editor.bubble.textColor")}
                  onMouseDown={(event) => event.preventDefault()}
                  className="size-8 [&_svg]:size-4"
                >
                  <PaletteIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="flex w-auto gap-1 p-1.5"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                {colors.map(({ key, value }) => (
                  <button
                    key={key}
                    type="button"
                    aria-label={t(`editor.bubble.${key}` as LostKey)}
                    title={t(`editor.bubble.${key}` as LostKey)}
                    onClick={() => {
                      if (value) editor.chain().focus().setColor(value).run();
                      else editor.chain().focus().unsetColor().run();
                    }}
                    className="size-6 rounded-full border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    style={{ background: value ?? "var(--foreground)" }}
                  />
                ))}
              </PopoverContent>
            </Popover>
            {state.link ? (
              <Tool
                label={t("editor.bubble.removeLink")}
                active
                onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
              >
                <UnlinkIcon />
              </Tool>
            ) : (
              <Tool
                label={t("editor.bubble.link")}
                onClick={() => {
                  setUrl(state.href);
                  setLinking(true);
                }}
              >
                <LinkIcon />
              </Tool>
            )}
          </>
        )}
      </div>
    </BubbleMenu>
  );
}
