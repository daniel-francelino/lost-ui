import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./data-table-pagination.stories";

const { Playground, FirstPage, LastPage, Empty, Disabled, WithPageSize } = composeStories(stories);

describe("DataTablePagination", () => {
  it("says which rows are shown and which page it is", () => {
    render(<Playground />);
    expect(screen.getByText("Showing 11–20 of 45")).toBeInTheDocument();
    expect(screen.getByText("Page 2 of 5")).toHaveAttribute("aria-current", "page");
  });

  it("is a labelled navigation", () => {
    render(<Playground />);
    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
  });

  it("asks for the previous and the next page", async () => {
    const onPageChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onPageChange={onPageChange} />);

    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenLastCalledWith(3);
  });

  it("cannot go before the first page or after the last", () => {
    const { rerender } = render(<FirstPage />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeEnabled();

    rerender(<LastPage />);
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
    expect(screen.getByText("Showing 41–45 of 45")).toBeInTheDocument();
  });

  it("says there are no records", () => {
    render(<Empty />);
    expect(screen.getByText("No records")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("disables everything when disabled", () => {
    render(<Disabled />);
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("lets the user choose how many rows a page has", async () => {
    const user = userEvent.setup();
    render(<WithPageSize />);

    await user.selectOptions(screen.getByRole("combobox", { name: "Rows per page" }), "25");

    expect(screen.getByRole("combobox", { name: "Rows per page" })).toHaveValue("25");
    expect(screen.getByText("Showing 1–25 of 45")).toBeInTheDocument();
  });

  it("shows no page size choice unless it is wired", () => {
    render(<Playground />);
    expect(screen.queryByRole("combobox")).toBeNull();
  });
});
