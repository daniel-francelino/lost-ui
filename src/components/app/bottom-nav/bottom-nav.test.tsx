import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import * as stories from "./bottom-nav.stories";

const { Playground, MoreIsActive, WithoutMore, ContextTabs } = composeStories(stories);

describe("BottomNav", () => {
  it("renders the destinations as links and marks the active one", () => {
    render(<Playground />);
    expect(screen.getByRole("navigation", { name: "Navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Calendar" })).not.toHaveAttribute("aria-current");
  });

  it("shows the badge, capped", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: /Products/ })).toHaveTextContent("9+");
  });

  it("hides from the large screens", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-slot='bottom-nav']")).toHaveClass("lg:hidden");
  });

  it("opens the more menu and lists the rest of the destinations", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    expect(screen.queryByRole("link", { name: "Customers" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "More" }));

    expect(screen.getByRole("button", { name: "More" })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Customers" })).toHaveAttribute(
      "href",
      "/admin/customers",
    );
  });

  it("closes the more menu with Escape and with the backdrop", async () => {
    const user = userEvent.setup();
    const { container } = render(<Playground />);

    await user.click(screen.getByRole("button", { name: "More" }));
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("link", { name: "Customers" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "More" }));
    await user.click(container.querySelector("[data-slot='bottom-nav-backdrop']")!);
    expect(screen.queryByRole("link", { name: "Customers" })).toBeNull();
  });

  it("marks More as active when one of its destinations is the page", () => {
    render(<MoreIsActive />);
    expect(screen.getByRole("button", { name: "More" })).toHaveClass("text-primary");
  });

  it("has no More button without more items", () => {
    render(<WithoutMore />);
    expect(screen.queryByRole("button", { name: "More" })).toBeNull();
  });

  it("swaps to the tabs of the page and handles their state", async () => {
    const user = userEvent.setup();
    render(<ContextTabs />);
    expect(screen.queryByRole("link", { name: "Home" })).toBeNull();
    expect(screen.queryByRole("button", { name: "More" })).toBeNull();
    expect(screen.getByRole("button", { name: "Inbox" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Sent" }));

    expect(screen.getByRole("button", { name: "Sent" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Inbox" })).toHaveAttribute("aria-pressed", "false");
  });

  it("draws one indicator, on the active destination", () => {
    const { container } = render(<Playground />);
    const indicators = container.querySelectorAll("[data-slot='bottom-nav-indicator']");
    expect(indicators).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Home" })).toContainElement(
      indicators[0] as HTMLElement,
    );
  });

  it("moves the indicator with the tabs of the page", async () => {
    const user = userEvent.setup();
    const { container } = render(<ContextTabs />);
    await user.click(screen.getByRole("button", { name: "Sent" }));
    const indicator = container.querySelector("[data-slot='bottom-nav-indicator']");
    expect(screen.getByRole("button", { name: "Sent" })).toContainElement(indicator as HTMLElement);
  });

  it("sets the height the page leaves free, and removes it", () => {
    const { unmount } = render(<Playground />);
    expect(document.documentElement.style.getPropertyValue("--bottom-nav-height")).toContain(
      "4.75rem",
    );
    unmount();
    expect(document.documentElement.style.getPropertyValue("--bottom-nav-height")).toBe("");
  });
});
