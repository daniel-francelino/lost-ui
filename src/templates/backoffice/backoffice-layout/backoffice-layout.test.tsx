import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./backoffice-layout.stories";

const { Playground, OnlyAllowedItems, WithoutExtras, FullScreen } = composeStories(stories);

describe("BackofficeLayout", () => {
  it("draws the sidebar with the navigation and marks the page", () => {
    render(<Playground />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    // the sidebar and the bottom bar both list it
    for (const link of screen.getAllByRole("link", { name: /Products/ })) {
      expect(link).toHaveAttribute("aria-current", "page");
    }
    expect(screen.getAllByRole("link", { name: "Calendar" }).length).toBeGreaterThan(0);
  });

  it("leaves out hidden items and the ones allow refuses", () => {
    const { unmount } = render(<Playground />);
    expect(screen.queryByRole("link", { name: "Inbox" })).toBeNull();
    expect(screen.getByRole("link", { name: "Customers" })).toBeInTheDocument();
    unmount();
    render(<OnlyAllowedItems />);
    expect(screen.queryByRole("link", { name: "Customers" })).toBeNull();
  });

  it("shows the breadcrumbs, the bell with the count and the space switcher", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "Catalogue" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute(
      "href",
      "/admin/notifications",
    );
    expect(screen.getByRole("link", { name: "Notifications" })).toHaveTextContent("3 unread");
    expect(screen.getByRole("button", { name: "Switch space" })).toBeInTheDocument();
  });

  it("shows the user and signs out from their menu", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(<Playground onSignOut={onSignOut} />);

    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    await user.click(await screen.findByRole("menuitem", { name: "Sign out" }));

    expect(onSignOut).toHaveBeenCalledOnce();
  });

  it("has the bottom bar of small screens", () => {
    render(<Playground />);
    expect(screen.getByRole("navigation", { name: "Navigation" })).toBeInTheDocument();
  });

  it("renders the page", () => {
    render(<Playground />);
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { name: "Products" }),
    );
  });

  it("leaves out what it was not given", () => {
    render(<WithoutExtras />);
    expect(screen.queryByRole("button", { name: "Switch space" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Notifications" })).toBeNull();
    expect(screen.queryByRole("navigation", { name: "Navigation" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Ada Lovelace/ })).toBeNull();
  });

  it("draws only the page when fullScreen", () => {
    render(<FullScreen />);
    expect(screen.queryByText("Acme")).toBeNull();
    expect(screen.getByRole("heading", { name: "Products" })).toBeInTheDocument();
  });
});
