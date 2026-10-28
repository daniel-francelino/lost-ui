import type { ReactNode } from "react";

export type FieldItem = {
  label: ReactNode;
  value: string;
  description?: ReactNode;
  disabled?: boolean;
  /** Shown before the label in lists. */
  icon?: ReactNode;
  /** Plain text for the search and for the input when `label` is not a string. */
  text?: string;
};

export type ItemInput = string | FieldItem;

export function normalizeItems(items: ItemInput[]): FieldItem[] {
  return items.map((item) => (typeof item === "string" ? { label: item, value: item } : item));
}

export function itemText(item: FieldItem): string {
  if (item.text !== undefined) return item.text;
  return typeof item.label === "string" || typeof item.label === "number"
    ? String(item.label)
    : item.value;
}
