import { composeStories } from "@storybook/react-vite";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider, lostI18n } from "../../i18n";
import { DataTable } from "./data-table";
import { columns, people, type Person } from "./data-table.fixtures";
import * as stories from "./data-table.stories";

const {
  Playground,
  Sortable,
  Searchable,
  Paginated,
  SelectableRows,
  RowActions,
  ActionsMenu,
  ColumnVisibility,
  ExpandableRows,
  TreeData,
  Loading,
  Refreshing,
  ErrorState,
  EmptyState,
  CustomEmpty,
  StickyHeader,
  PinnedColumns,
  Footer,
  Striped,
  ClickableRows,
  ServerSide,
} = composeStories(stories);

/** The text of the first cell of every body row, in order. */
const names = () =>
  screen
    .getAllByRole("row")
    .slice(1)
    .map((row) => within(row).getAllByRole("cell")[0]?.textContent ?? "");

describe("DataTable", () => {
  describe("rendering", () => {
    it("draws a table with a caption, headers and a row per item", () => {
      render(<Playground />);
      expect(screen.getByRole("table", { name: "People" })).toBeInTheDocument();
      expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
      expect(screen.getAllByRole("row")).toHaveLength(people.length + 1);
    });

    it("shows the value of the accessor and the cell of a column", () => {
      render(<Playground />);
      expect(screen.getByText("ada.lovelace@example.com")).toBeInTheDocument();
      expect(screen.getAllByText("active").length).toBeGreaterThan(0);
    });

    it("reads a value with a function accessor", () => {
      render(
        <DataTable
          data={[{ id: "1", first: "Ada", last: "Lovelace" }]}
          columns={[
            { id: "full", header: "Full name", accessor: (row) => `${row.first} ${row.last}` },
          ]}
        />,
      );
      expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    });

    it("shows dates, lists and empty values as text", () => {
      render(
        <DataTable
          data={[{ id: "1", at: new Date(2026, 0, 15), tags: ["a", "b"], none: null }]}
          columns={[
            { id: "at", header: "At", accessor: "at" },
            { id: "tags", header: "Tags", accessor: "tags" },
            { id: "none", header: "None", accessor: "none" },
          ]}
        />,
      );
      expect(screen.getByText("a, b")).toBeInTheDocument();
      expect(screen.getAllByRole("cell")[2]).toBeEmptyDOMElement();
    });

    it("aligns, sizes and styles a column", () => {
      render(
        <DataTable
          data={[{ id: "1", n: 7 }]}
          columns={[
            {
              id: "n",
              header: "N",
              accessor: "n",
              align: "right",
              width: 120,
              className: "cell-x",
              headerClassName: "head-x",
            },
          ]}
        />,
      );
      expect(screen.getByRole("columnheader", { name: "N" })).toHaveClass("text-right", "head-x");
      expect(screen.getByRole("columnheader", { name: "N" })).toHaveStyle({ width: "120px" });
      expect(screen.getByRole("cell", { name: "7" })).toHaveClass("cell-x");
    });

    it("uses the id of the row, then the position, as its key", () => {
      render(
        <DataTable
          selectable
          data={[{ name: "No id" }, { id: 7, name: "With id" }]}
          columns={[{ id: "name", header: "Name", accessor: "name" }]}
        />,
      );
      expect(screen.getByRole("checkbox", { name: "Select 0" })).toBeInTheDocument();
      expect(screen.getByRole("checkbox", { name: "Select 7" })).toBeInTheDocument();
    });

    it("takes the id of a row from getRowId", () => {
      render(
        <DataTable
          selectable
          getRowId={(row) => `person-${row.name}`}
          data={[{ name: "Ada" }]}
          columns={[{ id: "name", header: "Name", accessor: "name" }]}
        />,
      );
      expect(screen.getByRole("checkbox", { name: "Select person-Ada" })).toBeInTheDocument();
    });

    it("applies striped and dense styles", () => {
      render(<Striped />);
      const rows = screen.getAllByRole("row").slice(1);
      expect(rows[1]).toHaveClass("bg-muted/40");
      expect(within(rows[0]!).getAllByRole("cell")[0]).toHaveClass("py-1.5");
    });

    it("styles a row from rowClassName", () => {
      render(<Playground rowClassName={(row) => (row.age > 40 ? "senior" : undefined)} />);
      const senior = people.filter((person) => person.age > 40).length;
      expect(document.querySelectorAll("tr.senior")).toHaveLength(senior);
    });
  });

  describe("columns", () => {
    it("starts without the columns marked defaultHidden", () => {
      render(<Playground />);
      expect(screen.queryByRole("columnheader", { name: "Joined" })).toBeNull();
    });

    it("shows and hides a column from the menu", async () => {
      const user = userEvent.setup();
      render(<ColumnVisibility />);

      await user.click(screen.getByRole("button", { name: "Columns" }));
      await user.click(await screen.findByRole("menuitemcheckbox", { name: "Joined" }));
      await user.click(screen.getByRole("menuitemcheckbox", { name: "Email" }));
      // the open menu hides the table from screen readers
      await user.keyboard("{Escape}");

      expect(screen.getByRole("columnheader", { name: "Joined" })).toBeInTheDocument();
      expect(screen.queryByRole("columnheader", { name: "Email" })).toBeNull();
    });

    it("lists only the columns that can be hidden", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          columnToggle
          data={people}
          columns={[
            { id: "name", header: "Name", accessor: "name", hideable: false },
            { id: "email", header: "Email", accessor: "email" },
          ]}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Columns" }));

      expect(await screen.findByRole("menuitemcheckbox", { name: "Email" })).toBeInTheDocument();
      expect(screen.queryByRole("menuitemcheckbox", { name: "Name" })).toBeNull();
    });

    it("can be driven from outside", () => {
      const { rerender } = render(
        <DataTable data={people} columns={columns} columnVisibility={{ email: false }} />,
      );
      expect(screen.queryByRole("columnheader", { name: "Email" })).toBeNull();

      rerender(<DataTable data={people} columns={columns} columnVisibility={{}} />);
      expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
    });
  });

  describe("sorting", () => {
    it("cycles a column through ascending, descending and the order of the data", async () => {
      const user = userEvent.setup();
      render(<Playground />);
      const original = names();

      await user.click(screen.getByRole("button", { name: "Age" }));
      expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute(
        "aria-sort",
        "ascending",
      );
      const ages = screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => Number(within(row).getAllByRole("cell")[4]?.textContent));
      expect(ages).toEqual([...ages].sort((a, b) => a - b));

      await user.click(screen.getByRole("button", { name: "Age" }));
      expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute(
        "aria-sort",
        "descending",
      );

      await user.click(screen.getByRole("button", { name: "Age" }));
      expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute(
        "aria-sort",
        "none",
      );
      expect(names()).toEqual(original);
    });

    it("sorts texts without regard to case or accents order of the locale", async () => {
      const user = userEvent.setup();
      render(<Playground />);

      await user.click(screen.getByRole("button", { name: "Name" }));

      expect(names()[0]).toBe("Ada Lovelace");
      expect(names().at(-1)).toBe("Radia Perlman");
    });

    it("starts from the sort it is given", () => {
      render(<Sortable />);
      expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute(
        "aria-sort",
        "descending",
      );
    });

    it("reports a change of sort", async () => {
      const onSortChange = vi.fn();
      const user = userEvent.setup();
      render(<Playground onSortChange={onSortChange} />);

      await user.click(screen.getByRole("button", { name: "Name" }));
      expect(onSortChange).toHaveBeenLastCalledWith({ id: "name", direction: "asc" });

      await user.click(screen.getByRole("button", { name: "Email" }));
      expect(onSortChange).toHaveBeenLastCalledWith({ id: "email", direction: "asc" });
    });

    it("does not sort a column that is not sortable", () => {
      render(
        <DataTable data={people} columns={[{ id: "name", header: "Name", accessor: "name" }]} />,
      );
      expect(screen.queryByRole("button", { name: "Name" })).toBeNull();
      expect(screen.getByRole("columnheader", { name: "Name" })).not.toHaveAttribute("aria-sort");
    });

    it("uses the compare function of a column", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          data={[
            { id: "1", name: "Aaaa" },
            { id: "2", name: "Bb" },
            { id: "3", name: "C" },
          ]}
          columns={[
            {
              id: "name",
              header: "Name",
              accessor: "name",
              sortable: true,
              compare: (a, b) => a.name.length - b.name.length,
            },
          ]}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Name" }));

      expect(names()).toEqual(["C", "Bb", "Aaaa"]);
    });

    it("only shows the state when the data is sorted by a server", async () => {
      const user = userEvent.setup();
      render(<Playground manualSort />);
      const original = names();

      await user.click(screen.getByRole("button", { name: "Name" }));

      expect(names()).toEqual(original);
      expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute(
        "aria-sort",
        "ascending",
      );
    });

    it("can be controlled", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <DataTable data={people} columns={columns} sort={{ id: "age", direction: "asc" }} />,
      );
      expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute(
        "aria-sort",
        "ascending",
      );

      await user.click(screen.getByRole("button", { name: "Age" }));
      expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute(
        "aria-sort",
        "ascending",
      );

      rerender(<DataTable data={people} columns={columns} sort={null} />);
      expect(screen.getByRole("columnheader", { name: "Age" })).toHaveAttribute(
        "aria-sort",
        "none",
      );
    });
  });

  describe("search", () => {
    it("filters the rows while typing and ignores case and accents", async () => {
      const user = userEvent.setup();
      render(<Searchable />);

      await user.type(screen.getByRole("searchbox", { name: "Search" }), "JOAO");

      expect(names()).toEqual(["João Silva"]);
    });

    it("searches every searchable column", async () => {
      const user = userEvent.setup();
      render(<Searchable />);

      await user.type(screen.getByRole("searchbox"), "viewer");

      expect(names().length).toBeGreaterThan(0);
      expect(names().length).toBeLessThan(people.length);
    });

    it("leaves a column out of the search with searchable false", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          searchable
          data={people}
          columns={[
            { id: "name", header: "Name", accessor: "name" },
            { id: "email", header: "Email", accessor: "email", searchable: false },
          ]}
        />,
      );

      await user.type(screen.getByRole("searchbox"), "example.com");

      expect(screen.getByText("No records")).toBeInTheDocument();
    });

    it("shows the empty state when nothing matches", async () => {
      const user = userEvent.setup();
      render(<Searchable />);

      await user.type(screen.getByRole("searchbox"), "zzzz");

      expect(screen.getByText("No records")).toBeInTheDocument();
    });

    it("takes a placeholder", () => {
      render(<Searchable />);
      expect(screen.getByPlaceholderText("Search people…")).toBeInTheDocument();
    });

    it("reports the search", async () => {
      const onSearchChange = vi.fn();
      const user = userEvent.setup();
      render(<Playground searchable onSearchChange={onSearchChange} />);

      await user.type(screen.getByRole("searchbox"), "ab");

      expect(onSearchChange).toHaveBeenLastCalledWith("ab");
    });

    it("starts from a search and can be controlled", () => {
      const { rerender } = render(<Playground defaultSearch="turing" />);
      expect(names()).toEqual(["Alan Turing"]);

      rerender(<Playground search="hopper" />);
      expect(names()).toEqual(["Grace Hopper"]);
    });

    it("does not filter when the data is filtered by a server", async () => {
      const user = userEvent.setup();
      render(<Playground searchable manualSearch />);

      await user.type(screen.getByRole("searchbox"), "zzzz");

      expect(names()).toHaveLength(people.length);
    });

    it("goes back to the first page when the search changes", async () => {
      const user = userEvent.setup();
      render(<Paginated />);

      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();

      await user.type(screen.getByRole("searchbox"), "a");

      expect(screen.getByText(/^Page 1 of/)).toBeInTheDocument();
    });
  });

  describe("pagination", () => {
    it("shows one page of the rows", () => {
      render(<Paginated />);
      expect(names()).toHaveLength(5);
      expect(screen.getByText("Showing 1–5 of 12")).toBeInTheDocument();
    });

    it("goes to the next and the previous page", async () => {
      const user = userEvent.setup();
      render(<Paginated />);

      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
      expect(names()).toEqual(people.slice(5, 10).map((person) => person.name));

      await user.click(screen.getByRole("button", { name: "Previous" }));
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });

    it("lets the user choose the page size", async () => {
      const user = userEvent.setup();
      render(<Paginated />);

      await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "10");

      expect(names()).toHaveLength(10);
    });

    it("reports the page and the page size", async () => {
      const onPageChange = vi.fn();
      const onPageSizeChange = vi.fn();
      const user = userEvent.setup();
      render(<Paginated onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />);

      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(onPageChange).toHaveBeenLastCalledWith(2);

      await user.selectOptions(screen.getByRole("combobox"), "25");
      expect(onPageSizeChange).toHaveBeenLastCalledWith(25);
    });

    it("keeps the page inside the range when the data shrinks", () => {
      const { rerender } = render(
        <DataTable data={people} columns={columns} pageSize={5} page={3} />,
      );
      expect(screen.getByText("Page 3 of 3")).toBeInTheDocument();

      rerender(<DataTable data={people.slice(0, 6)} columns={columns} pageSize={5} page={3} />);
      expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });

    it("does not paginate without a page size", () => {
      render(<Playground />);
      expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
    });

    it("shows the data as the current page when a total is given", async () => {
      const onPageChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DataTable
          data={people.slice(0, 3)}
          columns={columns}
          total={30}
          pageSize={3}
          page={2}
          onPageChange={onPageChange}
        />,
      );

      expect(names()).toHaveLength(3);
      expect(screen.getByText("Showing 4–6 of 30")).toBeInTheDocument();
      expect(screen.getByText("Page 2 of 10")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it("works with a server: sort, search and page are asked from outside", async () => {
      const user = userEvent.setup();
      render(<ServerSide />);

      expect(names()).toHaveLength(4);
      expect(screen.getByText("Showing 1–4 of 12")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(names()).toEqual(people.slice(4, 8).map((person) => person.name));

      await user.type(screen.getByRole("searchbox"), "ada");
      expect(names()).toEqual(["Ada Lovelace"]);
      expect(screen.getByText("Showing 1–1 of 1")).toBeInTheDocument();
    });
  });

  describe("selection", () => {
    it("adds a checkbox per row and one for the page", () => {
      render(<SelectableRows />);
      expect(screen.getByRole("checkbox", { name: "Select all rows on this page" })).toBeVisible();
      expect(screen.getAllByRole("checkbox")).toHaveLength(6 + 1);
    });

    it("starts with the rows it is given and counts them", () => {
      render(<SelectableRows />);
      expect(screen.getByRole("checkbox", { name: "Select Grace Hopper" })).toBeChecked();
      expect(screen.getByText("1 selected")).toBeInTheDocument();
    });

    it("selects and deselects a row and reports the ids", async () => {
      const onSelectedChange = vi.fn();
      const user = userEvent.setup();
      render(<SelectableRows onSelectedChange={onSelectedChange} />);

      await user.click(screen.getByRole("checkbox", { name: "Select Ada Lovelace" }));
      expect(onSelectedChange).toHaveBeenLastCalledWith(["2", "1"]);

      await user.click(screen.getByRole("checkbox", { name: "Select Grace Hopper" }));
      expect(onSelectedChange).toHaveBeenLastCalledWith(["1"]);
    });

    it("selects every selectable row of the page, and clears them", async () => {
      const user = userEvent.setup();
      render(<SelectableRows defaultSelected={[]} />);
      const all = screen.getByRole("checkbox", { name: "Select all rows on this page" });

      await user.click(all);
      // the rows of Alan Turing and Margaret Hamilton are blocked, so they are left out
      expect(screen.getByRole("checkbox", { name: "Select Alan Turing" })).not.toBeChecked();
      expect(screen.getByText("4 selected")).toBeInTheDocument();
      expect(all).toBeChecked();

      await user.click(all);
      expect(screen.queryByText(/selected/)).toBeNull();
    });

    it("shows a partial state when only some rows are selected", () => {
      render(<SelectableRows />);
      expect(
        screen.getByRole("checkbox", { name: "Select all rows on this page" }),
      ).toHaveAttribute("data-state", "indeterminate");
    });

    it("blocks a row with a reason and shows it", () => {
      render(<SelectableRows />);
      const blocked = screen.getByRole("checkbox", { name: "Select Alan Turing" });
      expect(blocked).toBeDisabled();
      expect(blocked).toHaveAttribute("title", "Blocked users stay as they are");
    });

    it("keeps the rows of other pages selected", async () => {
      const user = userEvent.setup();
      render(<SelectableRows defaultSelected={["11"]} />);

      await user.click(screen.getByRole("checkbox", { name: "Select all rows on this page" }));
      await user.click(screen.getByRole("button", { name: "Next" }));

      expect(screen.getByRole("checkbox", { name: "Select João Silva" })).toBeChecked();
    });

    it("can be controlled", async () => {
      const user = userEvent.setup();
      function Harness() {
        const [selected, setSelected] = useState<string[]>(["3"]);
        return (
          <>
            <DataTable
              data={people}
              columns={columns}
              selectable
              rowLabel={(row: Person) => row.name}
              selected={selected}
              onSelectedChange={setSelected}
            />
            <output>{selected.join(",")}</output>
          </>
        );
      }
      render(<Harness />);

      await user.click(screen.getByRole("checkbox", { name: "Select Ada Lovelace" }));

      expect(screen.getByRole("status")).toHaveTextContent("3,1");
    });

    it("marks the selected row", () => {
      render(<SelectableRows />);
      const row = screen.getByRole("checkbox", { name: "Select Grace Hopper" }).closest("tr");
      expect(row).toHaveAttribute("data-state", "selected");
      expect(row).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("expanded rows", () => {
    it("opens and closes the detail of a row", async () => {
      const user = userEvent.setup();
      render(<ExpandableRows />);

      expect(screen.queryByText(/joined on/)).toBeNull();
      await user.click(screen.getByRole("button", { name: "Expand Ada Lovelace" }));
      expect(screen.getByText(/Ada Lovelace joined on/)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Collapse Ada Lovelace" })).toHaveAttribute(
        "aria-expanded",
        "true",
      );

      await user.click(screen.getByRole("button", { name: "Collapse Ada Lovelace" }));
      expect(screen.queryByText(/Ada Lovelace joined on/)).toBeNull();
    });

    it("reports which rows are open and can start open", async () => {
      const onExpandedChange = vi.fn();
      const user = userEvent.setup();
      render(<ExpandableRows defaultExpanded={["2"]} onExpandedChange={onExpandedChange} />);

      expect(screen.getByText(/Grace Hopper joined on/)).toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Expand Ada Lovelace" }));

      expect(onExpandedChange).toHaveBeenLastCalledWith(["2", "1"]);
    });
  });

  describe("rows with rows below", () => {
    it("shows the top rows and opens one to show what is below", async () => {
      const user = userEvent.setup();
      render(<TreeData defaultExpanded={[]} />);

      expect(names()).toHaveLength(3);
      await user.click(screen.getByRole("button", { name: "Expand Ada Lovelace" }));

      expect(names()).toHaveLength(5);
    });

    it("indents each level", () => {
      render(<TreeData defaultExpanded={["1", "2"]} />);
      const depths = screen
        .getAllByRole("row")
        .slice(1)
        .map((row) => row.getAttribute("data-depth"));
      expect(depths.slice(0, 4)).toEqual(["0", "1", "2", "1"]);
    });

    it("opens everything that matches while searching", async () => {
      const user = userEvent.setup();
      render(<TreeData defaultExpanded={[]} searchable />);

      await user.type(screen.getByRole("searchbox"), "turing");

      expect(names()).toEqual(["Ada Lovelace", "Grace Hopper", "Alan Turing"]);
    });
  });

  describe("states", () => {
    it("draws placeholder rows while loading and says it is busy", () => {
      render(<Loading />);
      expect(document.querySelectorAll('[data-slot="data-table-skeleton"]')).toHaveLength(4);
      expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    });

    it("hides the pagination while loading", () => {
      render(<Paginated loading />);
      expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
    });

    it("keeps the rows dimmed and the controls blocked while refreshing", () => {
      render(<Refreshing selectable />);
      expect(screen.getAllByRole("row")[1]).toHaveClass("opacity-60");
      expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Name" })).toBeDisabled();
      expect(screen.getByRole("checkbox", { name: "Select all rows on this page" })).toBeDisabled();
    });

    it("shows an error with a retry button", async () => {
      const onRetry = vi.fn();
      const user = userEvent.setup();
      render(<ErrorState onRetry={onRetry} />);

      expect(screen.getByRole("alert")).toHaveTextContent("Could not load the people.");
      await user.click(screen.getByRole("button", { name: "Try again" }));

      expect(onRetry).toHaveBeenCalledOnce();
    });

    it("shows an error without a retry button when there is nothing to retry", () => {
      render(<ErrorState onRetry={undefined} />);
      expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
    });

    it("says there are no records", () => {
      render(<EmptyState />);
      expect(screen.getByText("No records")).toBeInTheDocument();
      expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
    });

    it("shows a custom empty state", () => {
      render(<CustomEmpty />);
      expect(screen.getByRole("heading", { name: "No people yet" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
    });

    it("spans the whole row with the state", () => {
      render(<EmptyState selectable />);
      const cell = screen.getByText("No records").closest("td");
      expect(cell).toHaveAttribute("colspan", "6");
    });
  });

  describe("actions and events", () => {
    it("adds an actions column with buttons named after the row", () => {
      render(<RowActions />);
      expect(screen.getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit: Ada Lovelace" })).toBeInTheDocument();
    });

    it("blocks an action with its reason", () => {
      render(<RowActions />);
      expect(
        screen.getByRole("button", { name: /Delete: Ada Lovelace\. An admin cannot be deleted/ }),
      ).toBeDisabled();
      expect(screen.getByRole("button", { name: "Delete: Grace Hopper" })).toBeEnabled();
    });

    it("can show the actions as a menu", async () => {
      const user = userEvent.setup();
      render(<ActionsMenu />);

      await user.click(screen.getAllByRole("button", { name: /^Actions for/ })[0]!);

      expect(await screen.findByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    });

    it("tells the row that was clicked", async () => {
      const onRowClick = vi.fn();
      const user = userEvent.setup();
      render(<ClickableRows onRowClick={onRowClick} />);

      await user.click(screen.getByText("ada.lovelace@example.com"));

      expect(onRowClick).toHaveBeenCalledOnce();
      expect(onRowClick.mock.calls[0]?.[0]).toMatchObject({ name: "Ada Lovelace" });
      expect(screen.getAllByRole("row")[1]).toHaveClass("cursor-pointer");
    });

    it("does not count a click on a control inside the row", async () => {
      const onRowClick = vi.fn();
      const user = userEvent.setup();
      render(<RowActions onRowClick={onRowClick} selectable />);

      await user.click(screen.getByRole("checkbox", { name: "Select Ada Lovelace" }));
      await user.click(screen.getByRole("button", { name: "Edit: Ada Lovelace" }));

      expect(onRowClick).not.toHaveBeenCalled();
    });

    it("tells the row of a right click", async () => {
      const onRowContextMenu = vi.fn();
      const user = userEvent.setup();
      render(<Playground onRowContextMenu={onRowContextMenu} />);

      await user.pointer({ keys: "[MouseRight]", target: screen.getByText("Grace Hopper") });

      expect(onRowContextMenu.mock.calls[0]?.[0]).toMatchObject({ name: "Grace Hopper" });
    });
  });

  describe("layout", () => {
    it("keeps the header on top when sticky", () => {
      render(<StickyHeader />);
      expect(document.querySelector("thead")).toHaveClass("sticky", "top-0");
    });

    it("sticks pinned columns to their side at an offset", () => {
      render(<PinnedColumns />);
      const name = screen.getByRole("columnheader", { name: "Name" });
      const id = screen.getByRole("columnheader", { name: "Id" });

      expect(name).toHaveClass("sticky");
      expect(name).toHaveStyle({ left: "0px" });
      expect(id).toHaveClass("sticky");
      expect(id).toHaveStyle({ right: "0px" });
    });

    it("starts the pinned columns after the checkbox column", () => {
      render(<PinnedColumns selectable />);
      expect(screen.getByRole("columnheader", { name: "Name" })).toHaveStyle({ left: "48px" });
    });

    it("draws a footer from the columns", () => {
      render(<Footer />);
      const footer = document.querySelector("tfoot")!;
      expect(within(footer).getByText("Average")).toBeInTheDocument();
      expect(within(footer).getByText(/^Avg \d+$/)).toBeInTheDocument();
    });

    it("draws no footer without footer cells", () => {
      render(<Playground />);
      expect(document.querySelector("tfoot")).toBeNull();
    });

    it("puts a toolbar before and after the controls", () => {
      render(
        <Playground
          searchable
          toolbar={<button type="button">Filters</button>}
          toolbarEnd={<button type="button">Export</button>}
        />,
      );
      expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
    });
  });

  describe("languages", () => {
    it("writes its own texts in the current language", async () => {
      const user = userEvent.setup();
      await lostI18n.changeLanguage("pt");
      try {
        render(
          <LostI18nProvider language="pt">
            <DataTable data={people} columns={columns} defaultPageSize={5} selectable searchable />
          </LostI18nProvider>,
        );

        expect(screen.getByRole("searchbox", { name: "Pesquisar" })).toBeInTheDocument();
        expect(
          screen.getByRole("checkbox", { name: "Selecionar todas as linhas desta página" }),
        ).toBeInTheDocument();
        expect(screen.getByText("Mostrando 1–5 de 12")).toBeInTheDocument();
        expect(screen.getByText("Página 1 de 3")).toBeInTheDocument();
        await user.click(screen.getByRole("button", { name: "Próxima" }));
        expect(screen.getByText("Página 2 de 3")).toBeInTheDocument();
      } finally {
        await lostI18n.changeLanguage("en");
      }
    });
  });
});
