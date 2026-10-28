import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./data-table-row-actions.stories";

const { Playground, Menu, ForcedMenu, Blocked, Disabled, NoActions } = composeStories(stories);

describe("DataTableRowActions", () => {
  it("shows up to two actions as buttons named after the row", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: "Edit: Ada" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete: Ada" })).toBeInTheDocument();
  });

  it("runs the action with the row", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Playground
        actions={[{ id: "edit", label: "Edit", onSelect }]}
        row={{ id: "9", name: "Grace" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /Edit/ }));

    expect(onSelect).toHaveBeenCalledWith({ id: "9", name: "Grace" });
  });

  it("marks a destructive action", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: "Delete: Ada" })).toHaveClass("text-destructive");
  });

  it("moves to a menu with more than two actions", async () => {
    const user = userEvent.setup();
    render(<Menu />);

    expect(screen.queryByRole("button", { name: "Edit: Ada" })).toBeNull();
    await user.click(screen.getByRole("button", { name: "Actions for Ada" }));

    expect(await screen.findByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Clone" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeInTheDocument();
  });

  it("runs a menu action with the row and closes the menu", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<ForcedMenu actions={[{ id: "edit", label: "Edit", onSelect }]} />);

    await user.click(screen.getByRole("button", { name: "Actions for Ada" }));
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expect(onSelect).toHaveBeenCalledWith({ id: "1", name: "Ada" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("blocks an action with a reason that is part of its name", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(
      <Blocked
        actions={[
          { id: "delete", label: "Delete", onSelect, disabledReason: "It has open orders" },
        ]}
      />,
    );

    const button = screen.getByRole("button", { name: /Delete: Ada\. It has open orders/ });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "It has open orders");
    await user.click(button);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("disables a menu action that is blocked", async () => {
    const user = userEvent.setup();
    render(
      <ForcedMenu
        actions={[{ id: "delete", label: "Delete", onSelect: vi.fn(), disabledReason: "In use" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Actions for Ada" }));

    expect(await screen.findByRole("menuitem", { name: "Delete" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("disables the buttons and the menu when disabled", () => {
    const { rerender } = render(<Disabled />);
    expect(screen.getByRole("button", { name: "Edit: Ada" })).toBeDisabled();

    rerender(<Disabled forceMenu />);
    expect(screen.getByRole("button", { name: "Actions for Ada" })).toBeDisabled();
  });

  it("renders nothing without actions", () => {
    const { container } = render(<NoActions />);
    expect(container).toBeEmptyDOMElement();
  });

  it("is named in the current language", async () => {
    const { lostI18n } = await import("../../i18n");
    await lostI18n.changeLanguage("pt");

    render(<ForcedMenu />);
    expect(screen.getByRole("button", { name: "Ações de Ada" })).toBeInTheDocument();

    await lostI18n.changeLanguage("en");
  });
});
