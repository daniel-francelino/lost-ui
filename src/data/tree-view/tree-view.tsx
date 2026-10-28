import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown, Folder, FolderOpen } from "lucide-react";

import { cn } from "../../lib/cn";
import { useControlled } from "../../lib/use-controlled";

export type TreeItem = {
  /** Identifies the item. Defaults to the label, so give an id when labels repeat. */
  id?: string;
  label: ReactNode;
  /** Plain text of the label, for the key when `label` is not a text. */
  text?: string;
  icon?: ReactNode;
  children?: TreeItem[];
  defaultExpanded?: boolean;
  disabled?: boolean;
  className?: string;
};

export type TreeEventContext = { preventDefault: () => void };

export type TreeItemState = {
  key: string;
  depth: number;
  selected: boolean;
  /** Some of the descendants are selected but the item itself is not. */
  indeterminate: boolean;
  expanded: boolean;
  hasChildren: boolean;
};

export type TreeColor =
  "primary" | "secondary" | "success" | "info" | "warning" | "destructive" | "neutral";
export type TreeSize = "xs" | "sm" | "md" | "lg" | "xl";

export type TreeViewProps = {
  items: TreeItem[];
  /** The key of an item. Defaults to `id`, then to the text of the label with the path above it. */
  getKey?: (item: TreeItem, path: string[]) => string;
  /** Keys of the selected items. With `multiple` off there is at most one. */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  /** With `replace` a second click on the selected item keeps it selected; with `toggle` it clears it. */
  selectionBehavior?: "toggle" | "replace";
  /** Selecting a parent selects everything below it. Needs `multiple`. */
  propagateSelect?: boolean;
  /** A parent is selected when all its children are. Needs `multiple`. */
  bubbleSelect?: boolean;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;
  /** Call `preventDefault` to stop the selection. */
  onSelect?: (item: TreeItem, context: TreeEventContext) => void;
  /** Call `preventDefault` to stop the item from opening or closing. */
  onToggle?: (item: TreeItem, context: TreeEventContext) => void;
  disabled?: boolean;
  /** The arrow keys go from the last item to the first and back. */
  loop?: boolean;
  color?: TreeColor;
  size?: TreeSize;
  renderLeading?: (item: TreeItem, state: TreeItemState & { select: () => void }) => ReactNode;
  renderLabel?: (item: TreeItem, state: TreeItemState) => ReactNode;
  renderTrailing?: (item: TreeItem, state: TreeItemState) => ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

type Node = {
  item: TreeItem;
  key: string;
  depth: number;
  parent: string | null;
  children: Node[];
  index: number;
  siblings: number;
};

const selectedColor: Record<TreeColor, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-foreground",
};

const sizes: Record<TreeSize, { row: string; icon: string }> = {
  xs: { row: "gap-1.5 px-1.5 py-0.5 text-xs", icon: "[&_svg]:size-3.5" },
  sm: { row: "gap-1.5 px-2 py-1 text-xs", icon: "[&_svg]:size-3.5" },
  md: { row: "gap-2 px-2 py-1.5 text-sm", icon: "[&_svg]:size-4" },
  lg: { row: "gap-2 px-2.5 py-2 text-base", icon: "[&_svg]:size-5" },
  xl: { row: "gap-2.5 px-3 py-2.5 text-base", icon: "[&_svg]:size-5" },
};

const INDENT = 20;

function labelText(item: TreeItem): string {
  if (item.text !== undefined) return item.text;
  return typeof item.label === "string" || typeof item.label === "number" ? String(item.label) : "";
}

function buildTree(
  items: TreeItem[],
  getKey: NonNullable<TreeViewProps["getKey"]>,
  parent: Node | null = null,
  path: string[] = [],
): Node[] {
  return items.map((item, index) => {
    const key = getKey(item, path);
    const node: Node = {
      item,
      key,
      depth: parent ? parent.depth + 1 : 0,
      parent: parent?.key ?? null,
      children: [],
      index,
      siblings: items.length,
    };
    node.children = buildTree(item.children ?? [], getKey, node, [...path, key]);
    return node;
  });
}

const descendants = (node: Node): Node[] =>
  node.children.flatMap((child) => [child, ...descendants(child)]);

export function TreeView({
  items,
  getKey,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  selectionBehavior = "toggle",
  propagateSelect = false,
  bubbleSelect = false,
  expanded: expandedProp,
  defaultExpanded,
  onExpandedChange,
  onSelect,
  onToggle,
  disabled = false,
  loop = false,
  color = "primary",
  size = "md",
  renderLeading,
  renderLabel,
  renderTrailing,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: TreeViewProps) {
  const keyOf = useMemo<NonNullable<TreeViewProps["getKey"]>>(
    () =>
      getKey ??
      ((item, path) => item.id ?? [...path, labelText(item) || String(path.length)].join("/")),
    [getKey],
  );
  const roots = useMemo(() => buildTree(items, keyOf), [items, keyOf]);
  const byKey = useMemo(() => {
    const all = new Map<string, Node>();
    const walk = (nodes: Node[]) =>
      nodes.forEach((node) => {
        all.set(node.key, node);
        walk(node.children);
      });
    walk(roots);
    return all;
  }, [roots]);

  const startOpen = useMemo(
    () => [...byKey.values()].filter((node) => node.item.defaultExpanded).map((node) => node.key),
    [byKey],
  );
  const [selection, setSelection] = useControlled<string[]>({
    ...(value !== undefined ? { value } : {}),
    defaultValue: defaultValue ?? [],
    ...(onValueChange ? { onValueChange } : {}),
  });
  const [open, setOpen] = useControlled<string[]>({
    ...(expandedProp !== undefined ? { value: expandedProp } : {}),
    defaultValue: defaultExpanded ?? startOpen,
    ...(onExpandedChange ? { onValueChange: onExpandedChange } : {}),
  });
  const selected = useMemo(() => new Set(selection ?? []), [selection]);
  const openKeys = useMemo(() => new Set(open ?? []), [open]);

  const visible = useMemo(() => {
    const list: Node[] = [];
    const walk = (nodes: Node[]) =>
      nodes.forEach((node) => {
        list.push(node);
        if (openKeys.has(node.key)) walk(node.children);
      });
    walk(roots);
    return list;
  }, [roots, openKeys]);

  const isDisabled = (node: Node) => {
    if (disabled) return true;
    for (let at: Node | undefined = node; at; at = at.parent ? byKey.get(at.parent) : undefined) {
      if (at.item.disabled) return true;
    }
    return false;
  };
  const enabled = visible.filter((node) => !isDisabled(node));

  const [focusKey, setFocusKey] = useState<string | null>(null);
  const tabKey =
    focusKey !== null && enabled.some((node) => node.key === focusKey)
      ? focusKey
      : (enabled.find((node) => selected.has(node.key)) ?? enabled[0])?.key;
  const refs = useRef(new Map<string, HTMLElement>());

  const focusNode = (node: Node | undefined) => {
    if (!node) return;
    setFocusKey(node.key);
    refs.current.get(node.key)?.focus();
  };

  const stateOf = (node: Node): TreeItemState => {
    const below = descendants(node);
    return {
      key: node.key,
      depth: node.depth,
      selected: selected.has(node.key),
      indeterminate: !selected.has(node.key) && below.some((child) => selected.has(child.key)),
      expanded: openKeys.has(node.key),
      hasChildren: node.children.length > 0,
    };
  };

  const toggleOpen = (node: Node) => {
    let prevented = false;
    onToggle?.(node.item, { preventDefault: () => (prevented = true) });
    if (prevented) return;
    setOpen(
      openKeys.has(node.key)
        ? [...openKeys].filter((key) => key !== node.key)
        : [...openKeys, node.key],
    );
  };

  const choose = (node: Node) => {
    let prevented = false;
    onSelect?.(node.item, { preventDefault: () => (prevented = true) });
    if (prevented) return;

    const next = new Set(selected);
    const on = selected.has(node.key);

    if (!multiple) {
      if (on && selectionBehavior === "replace") return;
      next.clear();
      if (!on) next.add(node.key);
    } else {
      const group = propagateSelect ? [node, ...descendants(node)] : [node];
      for (const member of group) {
        if (on) next.delete(member.key);
        else next.add(member.key);
      }
      if (bubbleSelect) {
        for (
          let at = node.parent ? byKey.get(node.parent) : undefined;
          at;
          at = at.parent ? byKey.get(at.parent) : undefined
        ) {
          if (at.children.every((child) => next.has(child.key))) next.add(at.key);
          else next.delete(at.key);
        }
      }
    }
    setSelection([...next]);
  };

  const activate = (node: Node) => {
    choose(node);
    if (node.children.length > 0) toggleOpen(node);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>, node: Node) => {
    const at = enabled.findIndex((item) => item.key === node.key);
    const go = (index: number) => {
      event.preventDefault();
      focusNode(enabled[index]);
    };

    switch (event.key) {
      case "ArrowDown":
        if (at < enabled.length - 1) go(at + 1);
        else if (loop) go(0);
        else event.preventDefault();
        break;
      case "ArrowUp":
        if (at > 0) go(at - 1);
        else if (loop) go(enabled.length - 1);
        else event.preventDefault();
        break;
      case "Home":
        go(0);
        break;
      case "End":
        go(enabled.length - 1);
        break;
      case "ArrowRight":
        event.preventDefault();
        if (node.children.length === 0) break;
        if (!openKeys.has(node.key)) toggleOpen(node);
        else focusNode(enabled.find((item) => item.parent === node.key));
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (node.children.length > 0 && openKeys.has(node.key)) toggleOpen(node);
        else if (node.parent) focusNode(byKey.get(node.parent));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(node);
        break;
    }
  };

  const { row, icon } = sizes[size];

  return (
    <ul
      role="tree"
      data-slot="tree-view"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-multiselectable={multiple || undefined}
      aria-disabled={disabled || undefined}
      className={cn("grid gap-0.5", className)}
    >
      {visible.map((node) => {
        const state = stateOf(node);
        const blocked = isDisabled(node);
        const defaultMark =
          node.item.icon ??
          (state.hasChildren ? (
            state.expanded ? (
              <FolderOpen aria-hidden="true" />
            ) : (
              <Folder aria-hidden="true" />
            )
          ) : null);

        return (
          <li
            key={node.key}
            ref={(element) => {
              if (element) refs.current.set(node.key, element);
              else refs.current.delete(node.key);
            }}
            role="treeitem"
            aria-level={node.depth + 1}
            aria-setsize={node.siblings}
            aria-posinset={node.index + 1}
            aria-expanded={state.hasChildren ? state.expanded : undefined}
            aria-selected={state.selected}
            aria-disabled={blocked || undefined}
            tabIndex={blocked ? undefined : node.key === tabKey ? 0 : -1}
            data-state={state.selected ? "selected" : undefined}
            onKeyDown={(event) => {
              if (event.target === event.currentTarget) onKeyDown(event, node);
            }}
            onFocus={(event) => {
              if (event.target === event.currentTarget) setFocusKey(node.key);
            }}
            onClick={(event) => {
              event.stopPropagation();
              if (!blocked) {
                setFocusKey(node.key);
                activate(node);
              }
            }}
            style={{ paddingLeft: node.depth * INDENT }}
            className={cn(
              "list-none outline-none",
              blocked && "pointer-events-none opacity-50",
              node.item.className,
            )}
          >
            <div
              data-slot="tree-row"
              className={cn(
                "flex cursor-pointer select-none items-center rounded-md hover:bg-accent focus-visible:ring-2",
                "[[role=treeitem]:focus-visible>&]:ring-2 [[role=treeitem]:focus-visible>&]:ring-ring",
                row,
                icon,
                state.selected && selectedColor[color],
              )}
            >
              {renderLeading?.(node.item, { ...state, select: () => choose(node) })}
              {defaultMark && (
                <span aria-hidden="true" className="flex shrink-0 text-muted-foreground">
                  {defaultMark}
                </span>
              )}
              <span className="flex-1 truncate">
                {renderLabel ? renderLabel(node.item, state) : node.item.label}
              </span>
              {renderTrailing?.(node.item, state)}
              {state.hasChildren && (
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    "shrink-0 text-muted-foreground transition-transform",
                    !state.expanded && "-rotate-90",
                  )}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
