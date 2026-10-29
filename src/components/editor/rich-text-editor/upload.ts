import { Extension, type Editor } from "@tiptap/core";
import type { ResolvedPos } from "@tiptap/pm/model";
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { normalizeUpload, type EditorUploadResult } from "./reference";

export type UploadKind = "image" | "file";

type Placeholder = {
  id: string;
  kind: UploadKind;
  name: string;
  status: "pending" | "failed";
  pos: number;
  /** Position among the files of one batch: keeps them in order at the same spot. */
  order: number;
  /** The first file of a batch takes the place of an empty paragraph. */
  replaceEmpty: boolean;
};

type PlaceholderMeta =
  { type: "add"; placeholder: Placeholder } | { type: "fail" | "remove"; id: string };

export type UploadLabels = {
  uploading: (name: string) => string;
  failed: (name: string) => string;
  dismiss: string;
};

const placeholderKey = new PluginKey<Placeholder[]>("lostEditorUpload");

const placeholdersOf = (state: EditorState) => placeholderKey.getState(state) ?? [];

function placeholderElement(
  placeholder: Placeholder,
  labels: UploadLabels,
  dismiss: () => void,
): HTMLElement {
  const failed = placeholder.status === "failed";
  const element = document.createElement("div");
  element.setAttribute("data-slot", "editor-upload-placeholder");
  element.setAttribute("data-status", placeholder.status);
  element.setAttribute("data-kind", placeholder.kind);
  element.setAttribute("role", failed ? "alert" : "status");
  element.contentEditable = "false";
  element.className = [
    "my-3 flex items-center gap-2 rounded-lg border border-dashed px-3 py-2 text-sm",
    failed
      ? "border-destructive/50 bg-destructive/5 text-destructive"
      : "bg-muted/50 text-muted-foreground",
  ].join(" ");

  if (!failed) {
    const spinner = document.createElement("span");
    spinner.setAttribute("aria-hidden", "true");
    spinner.className =
      "size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent";
    element.append(spinner);
  }

  const text = document.createElement("span");
  text.className = "min-w-0 flex-1 truncate";
  text.textContent = failed ? labels.failed(placeholder.name) : labels.uploading(placeholder.name);
  element.append(text);

  if (failed) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "shrink-0 text-xs underline underline-offset-4";
    button.textContent = labels.dismiss;
    button.addEventListener("mousedown", (event) => event.preventDefault());
    button.addEventListener("click", dismiss);
    element.append(button);
  }
  return element;
}

/**
 * Shows a placeholder where a file is being uploaded, and when the upload fails. The placeholders
 * are decorations, not nodes: they never reach the JSON or the HTML.
 */
export const UploadPlaceholders = Extension.create<{ getLabels: () => UploadLabels }>({
  name: "uploadPlaceholders",

  addOptions() {
    return {
      getLabels: () => ({ uploading: (name) => name, failed: (name) => name, dismiss: "×" }),
    };
  },

  addProseMirrorPlugins() {
    const { getLabels } = this.options;
    return [
      new Plugin<Placeholder[]>({
        key: placeholderKey,
        state: {
          init: () => [],
          apply(tr, list) {
            // assoc 1: what is inserted at the spot (the file that just arrived) goes before the ones still waiting
            let next = tr.docChanged
              ? list.map((item) => ({ ...item, pos: tr.mapping.map(item.pos, 1) }))
              : list;
            const meta = tr.getMeta(placeholderKey) as PlaceholderMeta | undefined;
            if (meta?.type === "add") next = [...next, meta.placeholder];
            else if (meta?.type === "remove") next = next.filter((item) => item.id !== meta.id);
            else if (meta?.type === "fail")
              next = next.map((item) =>
                item.id === meta.id ? { ...item, status: "failed" as const } : item,
              );
            return next;
          },
        },
        props: {
          decorations(state) {
            const list = placeholdersOf(state);
            if (list.length === 0) return DecorationSet.empty;
            return DecorationSet.create(
              state.doc,
              list.map((item) =>
                Decoration.widget(
                  Math.min(item.pos, state.doc.content.size),
                  (view) =>
                    placeholderElement(item, getLabels(), () =>
                      view.dispatch(
                        view.state.tr.setMeta(placeholderKey, {
                          type: "remove",
                          id: item.id,
                        } satisfies PlaceholderMeta),
                      ),
                    ),
                  { key: `${item.id}-${item.status}`, side: item.order },
                ),
              ),
            );
          },
        },
      }),
    ];
  },
});

/** The images in the text plus the ones still being uploaded. */
export function countImages(editor: Editor): number {
  let count = placeholdersOf(editor.state).filter(
    (item) => item.kind === "image" && item.status === "pending",
  ).length;
  editor.state.doc.descendants((node) => {
    if (node.type.name === "image") count += 1;
  });
  return count;
}

/** Where a block can go from a position: between the top-level blocks, over an empty paragraph if there is one. */
export function insertionPoint($pos: ResolvedPos): { pos: number; replaceEmpty: boolean } {
  if ($pos.depth === 0) return { pos: $pos.pos, replaceEmpty: false };
  const block = $pos.node(1);
  if (block.isTextblock && block.content.size === 0) {
    return { pos: $pos.before(1), replaceEmpty: true };
  }
  return { pos: $pos.after(1), replaceEmpty: false };
}

export type UploadConfig = {
  uploadImage?: ((file: File) => Promise<EditorUploadResult>) | undefined;
  uploadFile?: ((file: File) => Promise<EditorUploadResult>) | undefined;
  maxImages?: number | undefined;
  onMaxImages?: ((max: number) => void) | undefined;
  onError?: ((error: unknown, file: File) => void) | undefined;
};

export type UploadOptions = {
  /** A position in the document; the blocks go between the top-level blocks next to it. The cursor by default. */
  at?: number | undefined;
  /** Treat every file as this kind. By default images are images and the rest are files. */
  as?: UploadKind | undefined;
  /** Put the cursor back in the editor once a file is in. */
  focus?: boolean | undefined;
};

let counter = 0;

/** Whether `uploadFiles` would take at least one of these files. */
export function canUpload(files: File[], config: UploadConfig, as?: UploadKind): boolean {
  return files.some((file) => kindOf(file, config, as) !== null);
}

function kindOf(file: File, config: UploadConfig, as?: UploadKind): UploadKind | null {
  const kind = as ?? (file.type.startsWith("image/") ? "image" : "file");
  if (kind === "image") return config.uploadImage ? "image" : null;
  return config.uploadFile ? "file" : null;
}

/**
 * Uploads files one after the other and puts each one in the text where the upload started, with a
 * placeholder until it is done. Images beyond `maxImages` are not uploaded.
 */
export async function uploadFiles(
  editor: Editor,
  files: File[],
  config: UploadConfig,
  options: UploadOptions = {},
): Promise<void> {
  let items = files.flatMap((file) => {
    const kind = kindOf(file, config, options.as);
    return kind ? [{ file, kind, id: `upload-${(counter += 1)}` }] : [];
  });

  const { maxImages } = config;
  if (maxImages !== undefined) {
    let room = Math.max(0, maxImages - countImages(editor));
    const kept = items.filter((item) => {
      if (item.kind !== "image") return true;
      if (room === 0) return false;
      room -= 1;
      return true;
    });
    if (kept.length < items.length) config.onMaxImages?.(maxImages);
    items = kept;
  }
  if (items.length === 0) return;

  const { doc, selection } = editor.state;
  const point = insertionPoint(
    options.at === undefined
      ? selection.$from
      : doc.resolve(Math.max(0, Math.min(options.at, doc.content.size))),
  );
  items.forEach((item, order) => {
    editor.view.dispatch(
      editor.state.tr.setMeta(placeholderKey, {
        type: "add",
        placeholder: {
          id: item.id,
          kind: item.kind,
          name: item.file.name,
          status: "pending",
          pos: point.pos,
          order,
          replaceEmpty: point.replaceEmpty && order === 0,
        },
      } satisfies PlaceholderMeta),
    );
  });

  for (const { file, kind, id } of items) {
    const upload = kind === "image" ? config.uploadImage : config.uploadFile;
    try {
      const result = normalizeUpload(await upload!(file));
      if (editor.isDestroyed) return;
      const placeholder = placeholdersOf(editor.state).find((item) => item.id === id);
      // the person dismissed it while it was uploading: nothing to put
      if (!placeholder) continue;

      const node =
        kind === "image"
          ? { type: "image", attrs: { alt: file.name, ...result.attrs, src: result.src } }
          : {
              type: "file",
              attrs: {
                name: file.name,
                size: file.size,
                mimeType: file.type || null,
                ...result.attrs,
                src: result.src,
              },
            };

      const chain = editor.chain();
      if (options.focus) chain.focus();
      chain
        .command(({ tr }) => {
          tr.setMeta(placeholderKey, { type: "remove", id } satisfies PlaceholderMeta);
          return true;
        })
        .insertContentAt(placeholder.pos, node)
        .command(({ tr }) => {
          // the file takes the place of the empty paragraph it was started from. The paragraph is
          // deleted after the insert, not replaced: a replaced range would push the files that are
          // still waiting to the front of this one
          if (!placeholder.replaceEmpty) return true;
          const after = placeholder.pos + (tr.doc.nodeAt(placeholder.pos)?.nodeSize ?? 0);
          const empty = tr.doc.nodeAt(after);
          if (empty?.isTextblock && empty.content.size === 0 && tr.doc.childCount > 1)
            tr.delete(after, after + empty.nodeSize);
          return true;
        })
        .run();
    } catch (error) {
      if (editor.isDestroyed) return;
      editor.view.dispatch(
        editor.state.tr.setMeta(placeholderKey, { type: "fail", id } satisfies PlaceholderMeta),
      );
      config.onError?.(error, file);
    }
  }
}
