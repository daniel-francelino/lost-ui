import type { ComponentProps, ReactNode } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import type { FieldItem } from "../lib/items";

export type FormOptionListProps = {
  id: string;
  items: FieldItem[];
  selected: string[];
  activeIndex?: number;
  multiple?: boolean;
  emptyText?: ReactNode;
  className?: string;
  onSelect: (item: FieldItem) => void;
  onActiveChange?: (index: number) => void;
  "aria-label"?: string;
  listProps?: Omit<ComponentProps<"ul">, "id" | "role" | "className" | "children">;
};

export function optionId(listId: string, index: number) {
  return `${listId}-option-${index}`;
}

export function FormOptionList({
  id,
  items,
  selected,
  activeIndex = -1,
  multiple = false,
  emptyText = "No results",
  className,
  onSelect,
  onActiveChange,
  "aria-label": ariaLabel,
  listProps,
}: FormOptionListProps) {
  if (items.length === 0) {
    return (
      <div role="status" className="px-2 py-3 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <ul
      id={id}
      role="listbox"
      aria-label={ariaLabel}
      aria-multiselectable={multiple || undefined}
      {...listProps}
      className={cn("grid gap-0.5", className)}
    >
      {items.map((item, index) => {
        const isSelected = selected.includes(item.value);

        return (
          <li
            key={item.value}
            id={optionId(id, index)}
            role="option"
            aria-selected={isSelected}
            aria-disabled={item.disabled || undefined}
            data-active={index === activeIndex ? "" : undefined}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
              "data-[active]:bg-accent data-[active]:text-accent-foreground hover:bg-accent/60",
              isSelected && "font-medium",
              item.disabled && "pointer-events-none opacity-50",
            )}
            onMouseEnter={() => onActiveChange?.(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => !item.disabled && onSelect(item)}
          >
            {item.icon}
            <span className="grid flex-1 gap-0.5">
              <span>{item.label}</span>
              {item.description && (
                <span className="text-xs text-muted-foreground">{item.description}</span>
              )}
            </span>
            {isSelected && <CheckIcon aria-hidden="true" className="size-4" />}
          </li>
        );
      })}
    </ul>
  );
}
