export type SortDirection = "asc" | "desc";

/** The column the table is sorted by, or `null` for the order of the data. */
export type SortState = { id: string; direction: SortDirection } | null;

export type ValueAccessor<T> = keyof T | ((row: T) => unknown);

/** What the model needs to know of a column, without the parts that draw it. */
export type ModelColumn<T> = {
  id: string;
  accessor?: ValueAccessor<T> | undefined;
  compare?: ((a: T, b: T) => number) | undefined;
  searchable?: boolean | undefined;
};

export type RowNode<T> = {
  row: T;
  id: string;
  depth: number;
  parentId: string | null;
  children: RowNode<T>[];
};

export function valueOf<T>(row: T, accessor: ValueAccessor<T> | undefined): unknown {
  if (accessor === undefined) return undefined;
  return typeof accessor === "function" ? accessor(row) : row[accessor];
}

/** Lower case and without accents, so "Joao" finds "João". */
export function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().toLowerCase();
  if (Array.isArray(value)) return value.map(normalizeText).join(" ");
  if (typeof value === "object") return "";

  return String(value).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

const isNothing = (value: unknown) => value === null || value === undefined || value === "";

/** Orders numbers, dates, booleans and texts (numbers inside a text by their value). Nothing goes last. */
export function compareValues(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "boolean" && typeof b === "boolean") return Number(a) - Number(b);

  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export function buildNodes<T>(
  data: T[],
  options: {
    getRowId: (row: T, index: number, parentId: string | null) => string;
    getSubRows?: ((row: T) => T[] | undefined) | undefined;
    parentId?: string | null;
    depth?: number;
  },
): RowNode<T>[] {
  const { getRowId, getSubRows, parentId = null, depth = 0 } = options;

  return data.map((row, index) => {
    const id = getRowId(row, index, parentId);
    const children = getSubRows?.(row) ?? [];

    return {
      row,
      id,
      depth,
      parentId,
      children: buildNodes(children, { getRowId, getSubRows, parentId: id, depth: depth + 1 }),
    };
  });
}

/**
 * Keeps the rows that match `search` in a searchable column, and the rows that have a match
 * below them, so a match is never cut off from its parents.
 */
export function filterNodes<T>(
  nodes: RowNode<T>[],
  search: string,
  columns: ModelColumn<T>[],
): RowNode<T>[] {
  const needle = normalizeText(search.trim());
  if (needle === "") return nodes;

  const searchable = columns.filter(
    (column) => column.accessor !== undefined && column.searchable !== false,
  );

  const walk = (list: RowNode<T>[]): RowNode<T>[] =>
    list.flatMap((node) => {
      const children = walk(node.children);
      const matches = searchable.some((column) =>
        normalizeText(valueOf(node.row, column.accessor)).includes(needle),
      );

      if (children.length > 0) return [{ ...node, children }];
      return matches ? [{ ...node, children: node.children }] : [];
    });

  return walk(nodes);
}

export function sortNodes<T>(
  nodes: RowNode<T>[],
  column: ModelColumn<T> | undefined,
  direction: SortDirection,
): RowNode<T>[] {
  if (!column) return nodes;
  const sign = direction === "asc" ? 1 : -1;

  const order = (a: RowNode<T>, b: RowNode<T>) => {
    if (column.compare) return sign * column.compare(a.row, b.row);

    const left = valueOf(a.row, column.accessor);
    const right = valueOf(b.row, column.accessor);
    if (isNothing(left) || isNothing(right)) {
      return Number(isNothing(left)) - Number(isNothing(right));
    }
    return sign * compareValues(left, right);
  };

  return [...nodes]
    .sort(order)
    .map((node) => ({ ...node, children: sortNodes(node.children, column, direction) }));
}

/** The rows a person sees: a row's children follow it when it is open. */
export function flattenNodes<T>(
  nodes: RowNode<T>[],
  expanded: ReadonlySet<string>,
  expandAll = false,
): RowNode<T>[] {
  return nodes.flatMap((node) => [
    node,
    ...(expandAll || expanded.has(node.id) ? flattenNodes(node.children, expanded, expandAll) : []),
  ]);
}

/** Ids of the rows that are not leaves, i.e. the ones that can be opened. */
export function branchIds<T>(nodes: RowNode<T>[]): string[] {
  return nodes.flatMap((node) =>
    node.children.length > 0 ? [node.id, ...branchIds(node.children)] : [],
  );
}
