import type { Meta, StoryObj } from "@storybook/react-vite";
import { PencilIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { fn } from "storybook/test";

import { Empty } from "../empty";
import { DataTable } from "./data-table";
import { columns, people, type Person } from "./data-table.fixtures";
import type { SortState } from "./table-model";

const meta = {
  title: "Data/DataTable",
  component: DataTable<Person>,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    data: people,
    columns,
    caption: "People",
    rowLabel: (row) => row.name,
  },
} satisfies Meta<typeof DataTable<Person>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sortable: Story = { args: { defaultSort: { id: "age", direction: "desc" } } };

export const Searchable: Story = {
  args: { searchable: true, searchPlaceholder: "Search people…" },
};

export const Paginated: Story = {
  args: { pageSize: 5, pageSizeOptions: [5, 10, 25], searchable: true },
};

export const SelectableRows: Story = {
  args: {
    selectable: true,
    defaultSelected: ["2"],
    isRowSelectable: (row) => row.status !== "blocked",
    selectionDisabledReason: (row) =>
      row.status === "blocked" ? "Blocked users stay as they are" : null,
    pageSize: 6,
  },
};

export const RowActions: Story = {
  args: {
    actions: (row) => [
      { id: "edit", label: "Edit", icon: PencilIcon, onSelect: fn() },
      {
        id: "delete",
        label: "Delete",
        icon: Trash2Icon,
        destructive: true,
        onSelect: fn(),
        disabledReason: row.role === "Admin" ? "An admin cannot be deleted" : undefined,
      },
    ],
  },
};

export const ActionsMenu: Story = {
  args: {
    actionsMenu: true,
    actions: () => [
      { id: "edit", label: "Edit", icon: PencilIcon, onSelect: fn() },
      { id: "delete", label: "Delete", icon: Trash2Icon, destructive: true, onSelect: fn() },
    ],
  },
};

export const ColumnVisibility: Story = {
  args: { columnToggle: true },
};

export const ExpandableRows: Story = {
  args: {
    renderExpanded: (row) => (
      <p className="text-sm text-muted-foreground">
        {row.name} joined on {row.joined.toLocaleDateString("en-US")} and is {row.age} years old.
      </p>
    ),
  },
};

export const TreeData: Story = {
  args: {
    data: [
      {
        ...people[0]!,
        reports: [{ ...people[1]!, reports: [{ ...people[2]! }] }, { ...people[3]! }],
      },
      { ...people[4]!, reports: [{ ...people[5]! }] },
      { ...people[6]! },
    ],
    getSubRows: (row) => row.reports,
    defaultExpanded: ["1"],
  },
};

export const Loading: Story = { args: { loading: true, loadingRows: 4 } };

export const Refreshing: Story = { args: { refreshing: true, pageSize: 5 } };

export const ErrorState: Story = {
  args: { error: "Could not load the people.", onRetry: fn() },
};

export const EmptyState: Story = { args: { data: [] } };

export const CustomEmpty: Story = {
  args: {
    data: [],
    empty: (
      <Empty
        variant="naked"
        icon={<UsersIcon />}
        title="No people yet"
        description="Invite someone to get started."
        actions={[{ label: "Invite", onClick: fn() }]}
      />
    ),
  },
};

export const StickyHeader: Story = {
  args: {
    sticky: true,
    className: "h-64",
    data: [...people, ...people.map((person) => ({ ...person, id: `${person.id}b` }))],
  },
};

export const PinnedColumns: Story = {
  args: {
    className: "max-w-xl",
    columns: [
      { ...columns[0]!, pinned: "left", width: 180 },
      { ...columns[1]!, width: 260 },
      { ...columns[2]!, width: 160 },
      { ...columns[3]!, width: 160 },
      { ...columns[4]!, width: 160 },
      { id: "id", header: "Id", accessor: "id", pinned: "right", width: 80 },
    ],
  },
};

export const Footer: Story = {
  args: {
    columns: columns.map((column) =>
      column.id === "age"
        ? {
            ...column,
            footer: (rows: Person[]) =>
              `Avg ${Math.round(rows.reduce((sum, row) => sum + row.age, 0) / Math.max(rows.length, 1))}`,
          }
        : column.id === "name"
          ? { ...column, footer: "Average" }
          : column,
    ),
  },
};

export const Striped: Story = { args: { striped: true, dense: true } };

export const ClickableRows: Story = { args: { onRowClick: fn() } };

/** The data is one page from a server; the table only draws what it is given. */
export const ServerSide: Story = {
  render: (args) => {
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<SortState>(null);
    const [search, setSearch] = useState("");
    const pageSize = 4;

    const result = useMemo(() => {
      const found = people.filter((person) =>
        person.name.toLowerCase().includes(search.toLowerCase()),
      );
      const ordered = sort
        ? [...found].sort(
            (a, b) =>
              (sort.direction === "asc" ? 1 : -1) *
              String(a[sort.id as keyof Person]).localeCompare(String(b[sort.id as keyof Person])),
          )
        : found;
      return { rows: ordered.slice((page - 1) * pageSize, page * pageSize), total: ordered.length };
    }, [page, sort, search]);

    return (
      <DataTable
        {...args}
        data={result.rows}
        total={result.total}
        page={page}
        onPageChange={setPage}
        pageSize={pageSize}
        sort={sort}
        onSortChange={setSort}
        manualSort
        search={search}
        onSearchChange={(next) => {
          setSearch(next);
          setPage(1);
        }}
        manualSearch
        searchable
      />
    );
  },
};
