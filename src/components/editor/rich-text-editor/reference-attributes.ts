import type { Attributes } from "@tiptap/core";

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

/**
 * Extra attributes of a node that points to a file (for example `mediaVersionId`). They stay in the
 * JSON as they are and in the HTML as `data-media-version-id`.
 */
export function referenceAttributes(names: readonly string[]): Attributes {
  return Object.fromEntries(
    names.map((name) => [
      name,
      {
        default: null,
        parseHTML: (element: HTMLElement) => element.getAttribute(`data-${kebab(name)}`),
        renderHTML: (attributes: Record<string, unknown>) => {
          const value = attributes[name];
          return value === null || value === undefined
            ? {}
            : { [`data-${kebab(name)}`]: String(value) };
        },
      },
    ]),
  );
}
