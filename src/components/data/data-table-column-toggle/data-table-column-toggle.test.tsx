import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DataTableColumnToggle } from "./data-table-column-toggle";
import * as stories from "./data-table-column-toggle.stories";

const { Playground, CustomLabel, Disabled } = composeStories(stories);

describe("DataTableColumnToggle", () => {
  it("opens a list of the columns with the visible ones checked", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("button", { name: "Columns" }));

    expect(await screen.findByRole("menuitemcheckbox", { name: "Name" })).toBeChecked();
    expect(screen.getByRole("menuitemcheckbox", { name: "Email" })).toBeChecked();
    expect(screen.getByRole("menuitemcheckbox", { name: "Role" })).not.toBeChecked();
  });

  it("shows and hides a column and keeps the menu open", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("button", { name: "Columns" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Role" }));
    expect(screen.getByRole("menuitemcheckbox", { name: "Role" })).toBeChecked();

    await user.click(screen.getByRole("menuitemcheckbox", { name: "Email" }));
    expect(screen.getByRole("menuitemcheckbox", { name: "Email" })).not.toBeChecked();
  });

  it("reports the column and the new state", async () => {
    const onVisibilityChange = vi.fn();
    const user = userEvent.setup();
    render(
      <DataTableColumnToggle
        columns={[
          { id: "name", label: "Name" },
          { id: "email", label: "Email" },
        ]}
        visibility={{}}
        onVisibilityChange={onVisibilityChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Columns" }));
    await user.click(await screen.findByRole("menuitemcheckbox", { name: "Name" }));

    expect(onVisibilityChange).toHaveBeenCalledWith("name", false);
  });

  it("does not let the last visible column be hidden", async () => {
    const user = userEvent.setup();
    render(
      <DataTableColumnToggle
        columns={[
          { id: "name", label: "Name" },
          { id: "email", label: "Email" },
          { id: "role", label: "Role" },
        ]}
        visibility={{ email: false, role: false }}
        onVisibilityChange={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Columns" }));

    expect(await screen.findByRole("menuitemcheckbox", { name: "Name" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("takes a custom label", () => {
    render(<CustomLabel />);
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
  });

  it("is disabled when locked", () => {
    render(<Disabled />);
    expect(screen.getByRole("button", { name: "Columns" })).toBeDisabled();
  });
});
