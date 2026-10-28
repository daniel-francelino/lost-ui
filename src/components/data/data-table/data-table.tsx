import { useMemo, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight, RotateCw, SearchIcon } from "lucide-react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { useControlled } from "../../../lib/use-controlled";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { Skeleton } from "../../ui/skeleton";
import {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { DataTableColumnToggle } from "../data-table-column-toggle";
import { DataTablePagination } from "../data-table-pagination";
import { DataTableRowActions, type DataTableAction } from "../data-table-row-actions";
import { Empty } from "../empty";
import {
  buildNodes,
  filterNodes,
  flattenNodes,
  sortNodes,
  valueOf,
  type RowNode,
  type SortState,
  type ValueAccessor,
} from "./table-model";

export type DataTableColumn<T> = {
  /** Unique. Names the column in the sort, the visibility and the pinning. */
  id: string;
  header: ReactNode;
  /** The value of a row for this column: a key of the row or a function. It feeds the cell, the sort and the search. */
  accessor?: ValueAccessor<T>;
  /** Draws the cell. Without it the value of `accessor` is shown as text. */
  cell?: (row: T, context: { value: unknown; index: number; depth: number }) => ReactNode;
  /** Shown in the footer row; a function receives the rows of the page. */
  footer?: ReactNode | ((rows: T[]) => ReactNode);
  sortable?: boolean;
  /** Replaces the default comparison of the values (ascending). */
  compare?: (a: T, b: T) => number;
  /** Set to `false` to leave the column out of the search. */
  searchable?: boolean;
  /** Set to `false` to keep the column out of the column menu. */
  hideable?: boolean;
  /** Starts hidden. */
  defaultHidden?: boolean;
  align?: "left" | "center" | "right";
  /** A number is a width in pixels. A pinned column needs a number. */
  width?: number | string;
  /** Sticks the column to a side while the table scrolls sideways. Give it a numeric `width`. */
  pinned?: "left" | "right";
  className?: string;
  headerClassName?: string;
};

export type DataTableProps<T> = {
  data: T[];
  columns: DataTableColumn<T>[];
  /** The id of a row, for selection and expansion. Defaults to `row.id`, then to the position. */
  getRowId?: (row: T, index: number) => string;
  /** Names a row for screen readers (select, expand, actions). Defaults to its id. */
  rowLabel?: (row: T) => string;
  /** Describes the table to screen readers. */
  caption?: string;
  className?: string;
  tableClassName?: string;

  /** Sorted by one column; click a header to go ascending, descending, then back to the order of the data. */
  sort?: SortState;
  defaultSort?: SortState;
  onSortChange?: (sort: SortState) => void;
  /** The data is already sorted (by a server): the table only shows the state. */
  manualSort?: boolean;

  /** Rows whose searchable columns contain this text (case and accents ignored). */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Shows a search field above the table. */
  searchable?: boolean;
  searchPlaceholder?: string;
  /** The data is already filtered (by a server). */
  manualSearch?: boolean;

  /** Paginates when `pageSize` or `defaultPageSize` is set. With `total` the data is one page from a server. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  defaultPageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  /** Number of rows in all pages. Makes the pagination manual: `data` is the current page only. */
  total?: number;

  /** Adds a checkbox per row. The value is the list of row ids. */
  selectable?: boolean;
  selected?: string[];
  defaultSelected?: string[];
  onSelectedChange?: (selected: string[]) => void;
  isRowSelectable?: (row: T) => boolean;
  /** A reason blocks the row's checkbox and is shown as its title. */
  selectionDisabledReason?: (row: T) => string | null | undefined;

  /** Opens a row to show more under it. Adds an arrow column. */
  renderExpanded?: (row: T) => ReactNode;
  /** Rows can have rows below them; the first column shows an arrow and indents each level. */
  getSubRows?: (row: T) => T[] | undefined;
  expanded?: string[];
  defaultExpanded?: string[];
  onExpandedChange?: (expanded: string[]) => void;

  columnVisibility?: Record<string, boolean>;
  defaultColumnVisibility?: Record<string, boolean>;
  onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
  /** Shows a menu above the table to show and hide columns. */
  columnToggle?: boolean;

  loading?: boolean;
  /** How many placeholder rows to draw while loading. */
  loadingRows?: number;
  /** New data is on its way: the rows stay, dimmed, and the controls are blocked. */
  refreshing?: boolean;
  error?: ReactNode;
  onRetry?: () => void;
  /** Shown when there are no rows. Defaults to a short message. */
  empty?: ReactNode;

  /** Per-row actions: up to two buttons, or a menu. */
  actions?: (row: T) => DataTableAction<T>[];
  actionsMenu?: boolean;
  onRowClick?: (row: T, event: MouseEvent<HTMLTableRowElement>) => void;
  onRowContextMenu?: (row: T, event: MouseEvent<HTMLTableRowElement>) => void;
  rowClassName?: (row: T) => string | undefined;

  /** The header stays on top while the body scrolls. Give the table a height with `className`. */
  sticky?: boolean;
  striped?: boolean;
  dense?: boolean;

  toolbar?: ReactNode;
  toolbarEnd?: ReactNode;
};

const SELECT_WIDTH = 48;
const EXPAND_WIDTH = 40;
const ACTIONS_WIDTH = 112;

const alignClass = { left: "text-left", center: "text-center", right: "text-right" } as const;

function defaultRowId(row: unknown, index: number, parentId: string | null): string {
  const id = (row as { id?: unknown } | null)?.id;
  if (typeof id === "string" || typeof id === "number") return String(id);
  return `${parentId ? `${parentId}.` : ""}${index}`;
}

function formatCell(value: unknown): ReactNode {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toLocaleDateString();
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object") return "";
  return String(value);
}

function SortButton({
  header,
  direction,
  disabled,
  onClick,
}: {
  header: ReactNode;
  direction: "asc" | "desc" | null;
  disabled: boolean;
  onClick: () => void;
}) {
  const { t } = useLostTranslation();
  const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={
        direction === "asc"
          ? t("dataTable.sortAscending")
          : direction === "desc"
            ? t("dataTable.sortDescending")
            : t("dataTable.sort")
      }
      className="-mx-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none"
    >
      {header}
      <Icon
        aria-hidden="true"
        className={cn("size-3.5", direction ? "text-foreground" : "text-muted-foreground/60")}
      />
    </button>
  );
}

export function DataTable<T>(props: DataTableProps<T>) {
  const { t } = useLostTranslation();
  const {
    data,
    columns,
    getRowId,
    rowLabel,
    caption,
    className,
    tableClassName,
    manualSort = false,
    manualSearch = false,
    searchable = false,
    searchPlaceholder,
    pageSizeOptions,
    total,
    selectable = false,
    isRowSelectable,
    selectionDisabledReason,
    renderExpanded,
    getSubRows,
    columnToggle = false,
    loading = false,
    loadingRows,
    refreshing = false,
    error,
    onRetry,
    empty,
    actions,
    actionsMenu = false,
    onRowClick,
    onRowContextMenu,
    rowClassName,
    sticky = false,
    striped = false,
    dense = false,
    toolbar,
    toolbarEnd,
  } = props;

  const [sort, setSort] = useControlled<SortState>({
    ...(props.sort !== undefined ? { value: props.sort } : {}),
    defaultValue: props.defaultSort ?? null,
    ...(props.onSortChange ? { onValueChange: props.onSortChange } : {}),
  });
  const [search, setSearch] = useControlled<string>({
    ...(props.search !== undefined ? { value: props.search } : {}),
    defaultValue: props.defaultSearch ?? "",
    ...(props.onSearchChange ? { onValueChange: props.onSearchChange } : {}),
  });
  const [page, setPage] = useControlled<number>({
    ...(props.page !== undefined ? { value: props.page } : {}),
    defaultValue: props.defaultPage ?? 1,
    ...(props.onPageChange ? { onValueChange: props.onPageChange } : {}),
  });
  const [pageSize, setPageSize] = useControlled<number>({
    ...(props.pageSize !== undefined ? { value: props.pageSize } : {}),
    defaultValue: props.defaultPageSize ?? 10,
    ...(props.onPageSizeChange ? { onValueChange: props.onPageSizeChange } : {}),
  });
  const [selected, setSelected] = useControlled<string[]>({
    ...(props.selected !== undefined ? { value: props.selected } : {}),
    defaultValue: props.defaultSelected ?? [],
    ...(props.onSelectedChange ? { onValueChange: props.onSelectedChange } : {}),
  });
  const [expanded, setExpanded] = useControlled<string[]>({
    ...(props.expanded !== undefined ? { value: props.expanded } : {}),
    defaultValue: props.defaultExpanded ?? [],
    ...(props.onExpandedChange ? { onValueChange: props.onExpandedChange } : {}),
  });
  const [visibility, setVisibility] = useControlled<Record<string, boolean>>({
    ...(props.columnVisibility !== undefined ? { value: props.columnVisibility } : {}),
    defaultValue:
      props.defaultColumnVisibility ??
      Object.fromEntries(
        columns.filter((column) => column.defaultHidden).map((column) => [column.id, false]),
      ),
    ...(props.onColumnVisibilityChange ? { onValueChange: props.onColumnVisibilityChange } : {}),
  });

  const paginate = (props.pageSize ?? props.defaultPageSize) !== undefined;
  const manualPagination = total !== undefined;
  const size = pageSize ?? 10;
  const query = search ?? "";
  const searchActive = !manualSearch && query.trim() !== "";
  const selectedIds = useMemo(() => new Set(selected ?? []), [selected]);
  const expandedIds = useMemo(() => new Set(expanded ?? []), [expanded]);
  const visible = columns.filter((column) => visibility?.[column.id] !== false);
  const hasExpander = renderExpanded !== undefined;
  const busy = loading || refreshing;

  const nodes = useMemo(
    () =>
      buildNodes(data, {
        getRowId: (row, index, parentId) =>
          getRowId ? getRowId(row, index) : defaultRowId(row, index, parentId),
        getSubRows,
      }),
    [data, getRowId, getSubRows],
  );

  const sorted = useMemo(() => {
    const filtered = searchActive ? filterNodes(nodes, query, columns) : nodes;
    const column = sort ? columns.find((item) => item.id === sort.id) : undefined;
    return !manualSort && sort && column ? sortNodes(filtered, column, sort.direction) : filtered;
  }, [nodes, searchActive, query, columns, sort, manualSort]);

  const totalRows = manualPagination ? total : sorted.length;
  const pages = paginate ? Math.max(1, Math.ceil(totalRows / size)) : 1;
  const currentPage = Math.min(Math.max(1, page ?? 1), pages);
  const pageNodes =
    paginate && !manualPagination
      ? sorted.slice((currentPage - 1) * size, currentPage * size)
      : sorted;
  const rows = flattenNodes(pageNodes, expandedIds, searchActive && getSubRows !== undefined);

  const labelOf = (node: RowNode<T>) => (rowLabel ? rowLabel(node.row) : node.id);
  const canSelect = (node: RowNode<T>) =>
    selectable && (isRowSelectable?.(node.row) ?? true) && !selectionDisabledReason?.(node.row);
  const selectableIds = rows.filter(canSelect).map((node) => node.id);
  const selectedOnPage = selectableIds.filter((id) => selectedIds.has(id)).length;
  const allSelected = selectableIds.length > 0 && selectedOnPage === selectableIds.length;
  const someSelected = selectedOnPage > 0 && !allSelected;

  const toggleSort = (id: string) => {
    setSort(
      !sort || sort.id !== id
        ? { id, direction: "asc" }
        : sort.direction === "asc"
          ? { id, direction: "desc" }
          : null,
    );
  };

  const toggleExpanded = (id: string) => {
    setExpanded(
      expandedIds.has(id) ? [...expandedIds].filter((item) => item !== id) : [...expandedIds, id],
    );
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelected(
      checked ? [...new Set([...selectedIds, id])] : [...selectedIds].filter((item) => item !== id),
    );
  };

  const togglePage = (checked: boolean) => {
    const onPage = new Set(selectableIds);
    setSelected(
      checked
        ? [...new Set([...selectedIds, ...selectableIds])]
        : [...selectedIds].filter((id) => !onPage.has(id)),
    );
  };

  // Sticky columns: the leading cells and the pinned columns each know their offset.
  const pinnedLeft = visible.filter((column) => column.pinned === "left");
  const pinnedRight = visible.filter((column) => column.pinned === "right");
  const leadingWidth = (selectable ? SELECT_WIDTH : 0) + (hasExpander ? EXPAND_WIDTH : 0);
  const offsets = new Map<string, CSSProperties>();
  let left = leadingWidth;
  for (const column of pinnedLeft) {
    offsets.set(column.id, { left });
    left += typeof column.width === "number" ? column.width : 0;
  }
  let right = actions ? ACTIONS_WIDTH : 0;
  for (const column of [...pinnedRight].reverse()) {
    offsets.set(column.id, { right });
    right += typeof column.width === "number" ? column.width : 0;
  }

  const columnStyle = (column: DataTableColumn<T>): CSSProperties => ({
    ...(column.width !== undefined ? { width: column.width, minWidth: column.width } : {}),
    ...offsets.get(column.id),
  });
  const pinClass = (column: DataTableColumn<T>, header: boolean) =>
    column.pinned ? cn("sticky bg-background", header ? "z-[3]" : "z-[1]") : undefined;

  const colSpan = visible.length + (selectable ? 1 : 0) + (hasExpander ? 1 : 0) + (actions ? 1 : 0);
  const cellPadding = dense ? "px-3 py-1.5" : "px-4 py-3";
  const hasFooter = visible.some((column) => column.footer !== undefined);
  const hasToolbar =
    searchable ||
    columnToggle ||
    toolbar !== undefined ||
    toolbarEnd !== undefined ||
    selectedIds.size > 0;
  const skeletonRows = loadingRows ?? (paginate ? Math.min(size, 10) : 5);
  const treeColumn = getSubRows ? visible[0] : undefined;

  const emptyContent = empty ?? <Empty variant="naked" size="sm" title={t("dataTable.empty")} />;

  const onRowActivate =
    (node: RowNode<T>, handler: typeof onRowClick | typeof onRowContextMenu) =>
    (event: MouseEvent<HTMLTableRowElement>) => {
      if ((event.target as HTMLElement).closest("button, a, input, label, [role='checkbox']")) {
        return;
      }
      handler?.(node.row, event);
    };

  return (
    <div data-slot="data-table" className={cn("grid gap-3", className)}>
      {hasToolbar && (
        <div data-slot="data-table-toolbar" className="flex flex-wrap items-center gap-2">
          {searchable && (
            <div className="relative w-full max-w-xs">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground"
              />
              <Input
                type="search"
                aria-label={t("dataTable.search")}
                placeholder={searchPlaceholder ?? t("dataTable.searchPlaceholder")}
                value={query}
                onChange={(event) => {
                  setSearch(event.target.value);
                  if (paginate) setPage(1);
                }}
                className="h-9 pl-8"
              />
            </div>
          )}
          {toolbar}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {selectedIds.size > 0 && (
              <span aria-live="polite" className="text-sm text-muted-foreground">
                {t("dataTable.selected", { count: selectedIds.size })}
              </span>
            )}
            {toolbarEnd}
            {columnToggle && (
              <DataTableColumnToggle
                columns={columns
                  .filter((column) => column.hideable !== false)
                  .map((column) => ({ id: column.id, label: column.header }))}
                visibility={visibility ?? {}}
                onVisibilityChange={(id, show) => setVisibility({ ...visibility, [id]: show })}
              />
            )}
          </div>
        </div>
      )}
      <div data-slot="data-table-scroll" className="relative overflow-auto rounded-md border">
        <table
          aria-busy={busy || undefined}
          className={cn("w-full caption-bottom text-sm", tableClassName)}
        >
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader
            className={cn(
              sticky && "sticky top-0 z-[2] bg-background shadow-[0_1px_0_var(--border)]",
            )}
          >
            <TableRow>
              {selectable && (
                <TableHead
                  scope="col"
                  style={{
                    width: SELECT_WIDTH,
                    minWidth: SELECT_WIDTH,
                    ...(pinnedLeft.length ? { left: 0 } : {}),
                  }}
                  className={cn("px-4", pinnedLeft.length > 0 && "sticky z-[3] bg-background")}
                >
                  <Checkbox
                    aria-label={t("dataTable.selectAll")}
                    checked={allSelected ? true : someSelected ? "indeterminate" : false}
                    disabled={busy || selectableIds.length === 0}
                    onCheckedChange={(checked) => togglePage(checked === true)}
                  />
                </TableHead>
              )}
              {hasExpander && (
                <TableHead
                  scope="col"
                  style={{
                    width: EXPAND_WIDTH,
                    minWidth: EXPAND_WIDTH,
                    ...(pinnedLeft.length ? { left: selectable ? SELECT_WIDTH : 0 } : {}),
                  }}
                  className={cn(pinnedLeft.length > 0 && "sticky z-[3] bg-background")}
                >
                  <span className="sr-only">{t("dataTable.expand")}</span>
                </TableHead>
              )}
              {visible.map((column) => {
                const direction = sort?.id === column.id ? sort.direction : null;

                return (
                  <TableHead
                    key={column.id}
                    scope="col"
                    aria-sort={
                      column.sortable
                        ? direction === "asc"
                          ? "ascending"
                          : direction === "desc"
                            ? "descending"
                            : "none"
                        : undefined
                    }
                    style={columnStyle(column)}
                    className={cn(
                      cellPadding,
                      column.align && alignClass[column.align],
                      pinClass(column, true),
                      column.headerClassName,
                    )}
                  >
                    {column.sortable ? (
                      <SortButton
                        header={column.header}
                        direction={direction}
                        disabled={busy}
                        onClick={() => toggleSort(column.id)}
                      />
                    ) : (
                      column.header
                    )}
                  </TableHead>
                );
              })}
              {actions && (
                <TableHead
                  scope="col"
                  style={{
                    width: ACTIONS_WIDTH,
                    minWidth: ACTIONS_WIDTH,
                    ...(pinnedRight.length ? { right: 0 } : {}),
                  }}
                  className={cn(
                    "px-4 text-right",
                    pinnedRight.length > 0 && "sticky z-[3] bg-background",
                  )}
                >
                  {t("dataTable.actions")}
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: skeletonRows }, (_, index) => (
                <TableRow key={index} data-slot="data-table-skeleton">
                  {Array.from({ length: colSpan }, (_, cell) => (
                    <TableCell key={cell} className={cellPadding}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="p-6 text-center">
                  <div role="alert">{error}</div>
                  {onRetry && (
                    <Button type="button" variant="outline" className="mt-3" onClick={onRetry}>
                      <RotateCw aria-hidden="true" />
                      {t("dataTable.retry")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow data-slot="data-table-empty">
                <TableCell colSpan={colSpan} className="p-2">
                  {emptyContent}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((node, index) => {
                const row = node.row;
                const isOpen = expandedIds.has(node.id);
                const hasChildren = node.children.length > 0;
                const reason = selectionDisabledReason?.(row);

                return (
                  <RowGroup key={node.id}>
                    <TableRow
                      data-state={selectedIds.has(node.id) ? "selected" : undefined}
                      data-depth={getSubRows ? node.depth : undefined}
                      aria-selected={selectable ? selectedIds.has(node.id) : undefined}
                      onClick={onRowClick ? onRowActivate(node, onRowClick) : undefined}
                      onContextMenu={
                        onRowContextMenu ? onRowActivate(node, onRowContextMenu) : undefined
                      }
                      className={cn(
                        onRowClick && "cursor-pointer",
                        striped && index % 2 === 1 && "bg-muted/40",
                        refreshing && "opacity-60",
                        rowClassName?.(row),
                      )}
                    >
                      {selectable && (
                        <TableCell
                          className="px-4"
                          style={{ width: SELECT_WIDTH, ...(pinnedLeft.length ? { left: 0 } : {}) }}
                        >
                          <Checkbox
                            aria-label={t("dataTable.selectRow", { row: labelOf(node) })}
                            title={reason ?? undefined}
                            checked={selectedIds.has(node.id)}
                            disabled={refreshing || !canSelect(node)}
                            onCheckedChange={(checked) => toggleRow(node.id, checked === true)}
                          />
                        </TableCell>
                      )}
                      {hasExpander && (
                        <TableCell
                          className="px-1"
                          style={{
                            width: EXPAND_WIDTH,
                            ...(pinnedLeft.length ? { left: selectable ? SELECT_WIDTH : 0 } : {}),
                          }}
                        >
                          <ExpandButton
                            open={isOpen}
                            label={labelOf(node)}
                            onClick={() => toggleExpanded(node.id)}
                          />
                        </TableCell>
                      )}
                      {visible.map((column) => {
                        const value = valueOf(row, column.accessor);
                        const content = column.cell
                          ? column.cell(row, { value, index, depth: node.depth })
                          : formatCell(value);
                        const isTree = column === treeColumn;

                        return (
                          <TableCell
                            key={column.id}
                            style={columnStyle(column)}
                            className={cn(
                              cellPadding,
                              column.align && alignClass[column.align],
                              pinClass(column, false),
                              column.className,
                            )}
                          >
                            {isTree ? (
                              <div
                                className="flex items-center gap-1"
                                style={{ paddingLeft: node.depth * 20 }}
                              >
                                {hasChildren ? (
                                  <ExpandButton
                                    open={isOpen}
                                    label={labelOf(node)}
                                    onClick={() => toggleExpanded(node.id)}
                                  />
                                ) : (
                                  <span
                                    aria-hidden="true"
                                    className="inline-block size-7 shrink-0"
                                  />
                                )}
                                {content}
                              </div>
                            ) : (
                              content
                            )}
                          </TableCell>
                        );
                      })}
                      {actions && (
                        <TableCell
                          className={cn(
                            "px-4 text-right",
                            pinnedRight.length > 0 && "sticky z-[1] bg-background",
                          )}
                          style={{
                            width: ACTIONS_WIDTH,
                            ...(pinnedRight.length ? { right: 0 } : {}),
                          }}
                        >
                          <DataTableRowActions
                            row={row}
                            label={labelOf(node)}
                            actions={actions(row)}
                            forceMenu={actionsMenu}
                            disabled={refreshing}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                    {renderExpanded && isOpen && (
                      <TableRow
                        data-slot="data-table-expanded"
                        className="bg-muted/30 hover:bg-muted/30"
                      >
                        <TableCell colSpan={colSpan} className={cellPadding}>
                          {renderExpanded(row)}
                        </TableCell>
                      </TableRow>
                    )}
                  </RowGroup>
                );
              })
            )}
          </TableBody>
          {hasFooter && !loading && (
            <TableFooter>
              <TableRow>
                {selectable && <TableCell />}
                {hasExpander && <TableCell />}
                {visible.map((column) => (
                  <TableCell
                    key={column.id}
                    className={cn(cellPadding, column.align && alignClass[column.align])}
                  >
                    {typeof column.footer === "function"
                      ? column.footer(rows.map((node) => node.row))
                      : column.footer}
                  </TableCell>
                ))}
                {actions && <TableCell />}
              </TableRow>
            </TableFooter>
          )}
        </table>
      </div>
      {paginate && !loading && !error && totalRows > 0 && (
        <DataTablePagination
          page={currentPage}
          pageSize={size}
          total={totalRows}
          onPageChange={setPage}
          onPageSizeChange={pageSizeOptions ? setPageSize : undefined}
          pageSizeOptions={pageSizeOptions}
          disabled={refreshing}
        />
      )}
    </div>
  );
}

/** A row and the rows that belong to it, without an element around them. */
function RowGroup({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function ExpandButton({
  open,
  label,
  onClick,
}: {
  open: boolean;
  label: string;
  onClick: () => void;
}) {
  const { t } = useLostTranslation();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-7 shrink-0"
      aria-expanded={open}
      aria-label={
        open ? t("dataTable.collapseRow", { row: label }) : t("dataTable.expandRow", { row: label })
      }
      onClick={onClick}
    >
      <ChevronRight
        aria-hidden="true"
        className={cn("size-4 transition-transform", open && "rotate-90")}
      />
    </Button>
  );
}
