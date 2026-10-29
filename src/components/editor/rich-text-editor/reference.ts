import { createContext, useContext, useEffect, useRef, useState } from "react";

/** What an upload gives back: the address, or the address with attributes that stay in the document (for example an id). */
export type EditorUploadResult = string | { src: string; attrs?: Record<string, unknown> };

/** The attributes of an image node, as stored in the document. */
export type EditorImageAttrs = {
  src: string;
  alt?: string | null;
  title?: string | null;
  [attribute: string]: unknown;
};

/** The attributes of a file node, as stored in the document. */
export type EditorFileAttrs = {
  src: string;
  name: string;
  size?: number | null;
  mimeType?: string | null;
  [attribute: string]: unknown;
};

/** Turns what the document stores (an id, an old address) into an address that can be shown now. */
export type ResolveImageSrc = (attrs: EditorImageAttrs) => string | Promise<string>;
export type ResolveFileHref = (attrs: EditorFileAttrs) => string | Promise<string>;

export type EditorResolvers = {
  resolveImageSrc?: ResolveImageSrc | undefined;
  resolveFileHref?: ResolveFileHref | undefined;
};

/** Gives the node views of the editor the resolvers of the app. */
export const EditorResolversContext = createContext<EditorResolvers>({});

export const useEditorResolvers = () => useContext(EditorResolversContext);

export function normalizeUpload(result: EditorUploadResult): {
  src: string;
  attrs: Record<string, unknown>;
} {
  return typeof result === "string"
    ? { src: result, attrs: {} }
    : { src: result.src, attrs: result.attrs ?? {} };
}

/** `1.5 MB`, `230 KB`, `12 B`. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
}

/**
 * The address to show for a node. Without a resolver it is the stored one. With one, the resolver
 * is asked when the node appears, when its attributes change and when the window gets the focus
 * again, so a signed address that expired is replaced by a fresh one. `null` while it is not known.
 */
export function useResolvedUrl<A extends { src: string }>(
  attrs: A,
  resolve: ((attrs: A) => string | Promise<string>) | undefined,
): string | null {
  const [url, setUrl] = useState<string | null>(resolve ? null : attrs.src);
  const resolver = useRef(resolve);
  resolver.current = resolve;
  const latest = useRef(attrs);
  latest.current = attrs;
  const key = JSON.stringify(attrs);
  const hasResolver = Boolean(resolve);

  useEffect(() => {
    if (!hasResolver) {
      setUrl(latest.current.src);
      return;
    }
    let cancelled = false;
    const run = () => {
      Promise.resolve()
        .then(() => resolver.current?.(latest.current))
        .then((next) => {
          if (!cancelled && typeof next === "string") setUrl(next);
        })
        .catch(() => {
          if (!cancelled) setUrl(null);
        });
    };
    run();
    window.addEventListener("focus", run);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", run);
    };
  }, [key, hasResolver]);

  return url;
}
