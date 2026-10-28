import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./settings-layout.stories";

const { Playground, SideNavigation, CustomTitle } = composeStories(stories);

describe("SettingsLayout", () => {
  it("shows the title and the page", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("The page.")).toBeInTheDocument();
  });

  it("lists the pages as links, without the hidden ones", () => {
    render(<Playground />);
    const nav = screen.getByRole("navigation", { name: "Settings" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Billing" })).toHaveAttribute(
      "href",
      "/settings/billing",
    );
    expect(screen.queryByRole("link", { name: "Security" })).toBeNull();
  });

  it("marks the active page, matching the exact one for General", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "General" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Billing" })).not.toHaveAttribute("aria-current");
  });

  it("does not keep General active on a page below", () => {
    render(<Playground pathname="/settings/notifications" />);
    expect(screen.getByRole("link", { name: "General" })).not.toHaveAttribute("aria-current");
    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("can put the navigation at the side", () => {
    render(<SideNavigation />);
    expect(screen.getByRole("link", { name: "Billing" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("navigation").parentElement).toHaveClass("md:grid-cols-[14rem_1fr]");
  });

  it("takes a custom title and description", () => {
    render(<CustomTitle />);
    expect(screen.getByRole("heading", { name: "Organisation" })).toBeInTheDocument();
    expect(screen.getByText("Settings of the whole team.")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Organisation" })).toBeInTheDocument();
  });

  it("draws one indicator, on the active tab, that follows the page", () => {
    const { container, rerender } = render(<Playground />);
    const indicators = () => container.querySelectorAll("[data-slot='settings-tab-indicator']");
    expect(indicators()).toHaveLength(1);
    expect(screen.getByRole("link", { name: "General" })).toContainElement(
      indicators()[0] as HTMLElement,
    );

    rerender(<Playground pathname="/settings/billing" />);

    expect(indicators()).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Billing" })).toContainElement(
      indicators()[0] as HTMLElement,
    );
  });
});
