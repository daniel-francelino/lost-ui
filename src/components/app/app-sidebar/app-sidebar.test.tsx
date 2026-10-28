import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./app-sidebar.stories";

const { Playground, SubMenuOpen, WithUserMenu, CustomLink } = composeStories(stories);

describe("AppSidebar", () => {
  it("renders the groups and the links", () => {
    render(<Playground />);
    expect(screen.getByText("Catalogue")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Calendar" })).toHaveAttribute(
      "href",
      "/admin/calendar",
    );
    expect(screen.getByRole("link", { name: "Customers" })).toBeInTheDocument();
  });

  it("renders only the sections it is given", () => {
    render(<Playground sections={[{ items: [{ title: "Only", to: "/only" }] }]} />);
    expect(screen.getByRole("link", { name: "Only" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Calendar" })).toBeNull();
  });

  it("marks the active page", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: /Products/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Calendar" })).not.toHaveAttribute("aria-current");
  });

  it("shows the badge with its text for screen readers", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: /Products/ }).parentElement).toHaveTextContent(
      "new: 3",
    );
  });

  it("opens the sub-menu of the active page", () => {
    render(<SubMenuOpen />);
    expect(screen.getByRole("link", { name: "Security" })).toHaveAttribute("aria-current", "page");
  });

  it("keeps the sub-menu closed when it is not active", () => {
    render(<Playground />);
    expect(screen.queryByRole("link", { name: "Security" })).toBeNull();
  });

  it("opens a sub-menu on click", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    await user.click(screen.getByRole("button", { name: "Settings" }));
    expect(screen.getByRole("link", { name: "Security" })).toBeInTheDocument();
  });

  it("calls onNavigate and onSelect when an item is followed", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    const onSelect = vi.fn();
    render(
      <Playground
        onNavigate={onNavigate}
        sections={[{ items: [{ title: "Go", to: "#go", onSelect }] }]}
      />,
    );
    await user.click(screen.getByRole("link", { name: "Go" }));
    expect(onNavigate).toHaveBeenCalledWith(expect.objectContaining({ title: "Go" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("renders an item with no address as a button", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Playground sections={[{ items: [{ title: "Action", onSelect }] }]} />);
    await user.click(screen.getByRole("button", { name: "Action" }));
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it("draws the links with renderLink", () => {
    const { container } = render(<CustomLink />);
    expect(container.querySelector("[data-router-link='Calendar']")).not.toBeNull();
  });

  it("shows the header and the footer", () => {
    render(<WithUserMenu />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ada Lovelace/ })).toBeInTheDocument();
  });
});
