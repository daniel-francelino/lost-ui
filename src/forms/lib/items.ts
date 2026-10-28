import type { ReactNode } from "react";

export type FieldItem = {
  label: ReactNode;
  value: string;
  description?: ReactNode;
  disabled?: boolean;
};

export type ItemInput = string | FieldItem;

export function normalizeItems(items: ItemInput[]): FieldItem[] {
  return items.map((item) => (typeof item === "string" ? { label: item, value: item } : item));
}

export function itemText(item: FieldItem): string {
  return typeof item.label === "string" || typeof item.label === "number"
    ? String(item.label)
    : item.value;
}
