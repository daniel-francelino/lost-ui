import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import { Suggestion, type SuggestionKeyDownProps, type SuggestionProps } from "@tiptap/suggestion";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { filterSlashItems, type SlashItem } from "./slash-items";

export type EditorSlashMenuHandle = { onKeyDown: (props: SuggestionKeyDownProps) => boolean };

type EditorSlashMenuProps = SuggestionProps<SlashItem, SlashItem>;

/** The list of blocks that opens when the user types `/`. It is drawn by the slash command. */
export const EditorSlashMenu = forwardRef<EditorSlashMenuHandle, EditorSlashMenuProps>(
  function EditorSlashMenu({ items, command, clientRect }, ref) {
    const { t } = useLostTranslation();
    const [selected, setSelected] = useState(0);
    const [position, setPosition] = useState<{ left: number; top: number } | null>(null);
    const active = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      setSelected(0);
    }, [items]);

    useLayoutEffect(() => {
      const rect = clientRect?.();
      if (rect) setPosition({ left: rect.left, top: rect.bottom + 6 });
    }, [clientRect, items]);

    // a block body: current Chrome returns a Promise, and React would treat it as a cleanup function
    useEffect(() => {
      active.current?.scrollIntoView({ block: "nearest" });
    }, [selected]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (items.length === 0) return false;
        if (event.key === "ArrowDown") {
          setSelected((index) => (index + 1) % items.length);
          return true;
        }
        if (event.key === "ArrowUp") {
          setSelected((index) => (index - 1 + items.length) % items.length);
          return true;
        }
        if (event.key === "Enter") {
          const item = items[selected];
          if (item) command(item);
          return true;
        }
        return false;
      },
    }));

    return (
      <div
        data-slot="editor-slash-menu"
        role="listbox"
        aria-label={t("editor.blocksLabel")}
        style={{ left: position?.left ?? 0, top: position?.top ?? 0 }}
        className="fixed z-50 max-h-80 w-72 overflow-y-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
      >
        {items.length === 0 ? (
          <p className="px-3 py-2 text-sm text-muted-foreground">{t("editor.noBlocks")}</p>
        ) : (
          items.map((item, index) => (
            <button
              key={item.id}
              ref={index === selected ? active : undefined}
              type="button"
              role="option"
              aria-selected={index === selected}
              onMouseEnter={() => setSelected(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                command(item);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left outline-none",
                index === selected && "bg-accent text-accent-foreground",
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background [&_svg]:size-4">
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">{item.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {item.description}
                </span>
              </span>
            </button>
          ))
        )}
      </div>
    );
  },
);

/** The extension that opens the menu when the user types `/` and runs the block that is picked. */
export const SlashCommand = Extension.create<{ getItems: () => SlashItem[] }>({
  name: "slashCommand",

  addOptions() {
    return { getItems: () => [] };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion<SlashItem, SlashItem>({
        editor: this.editor,
        char: "/",
        startOfLine: false,
        items: ({ query }) => filterSlashItems(this.options.getItems(), query),
        command: ({ editor, range, props }) => props.run({ editor, range }),
        render: () => {
          let renderer: ReactRenderer<EditorSlashMenuHandle, EditorSlashMenuProps> | null = null;
          return {
            onStart: (props) => {
              renderer = new ReactRenderer(EditorSlashMenu, { props, editor: props.editor });
              document.body.appendChild(renderer.element);
            },
            onUpdate: (props) => renderer?.updateProps(props),
            onKeyDown: (props) => {
              if (props.event.key === "Escape") {
                renderer?.element.remove();
                return true;
              }
              return renderer?.ref?.onKeyDown(props) ?? false;
            },
            onExit: () => {
              renderer?.element.remove();
              renderer?.destroy();
              renderer = null;
            },
          };
        },
      }),
    ];
  },
});
