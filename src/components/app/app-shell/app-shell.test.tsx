import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./app-shell.stories";

const { Playground, FullWidth, FullScreen, ClosedSidebar } = composeStories(stories);

describe("AppShell", () => {
  it("renders the sidebar, the top bar, the page and the bottom bar", () => {
    render(<Playground />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("The page")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigation" })).toBeInTheDocument();
  });

  it("brings a skip link to the page", () => {
    render(<Playground />);
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("main")).toHaveAttribute("tabindex", "-1");
  });

  it("centres the page in a column, unless fullWidth", () => {
    const { unmount } = render(<Playground />);
    expect(screen.getByRole("main")).toHaveClass("max-w-6xl");
    unmount();
    render(<FullWidth />);
    expect(screen.getByRole("main")).not.toHaveClass("max-w-6xl");
  });

  it("draws only the page when fullScreen", () => {
    render(<FullScreen />);
    expect(screen.getByText("The page")).toBeInTheDocument();
    expect(screen.queryByText("Acme")).toBeNull();
    expect(screen.queryByRole("banner")).toBeNull();
    expect(screen.queryByRole("link", { name: "Skip to content" })).toBeNull();
  });

  it("opens and closes the sidebar from the top bar", async () => {
    const user = userEvent.setup();
    const onSidebarOpenChange = vi.fn();
    render(<Playground onSidebarOpenChange={onSidebarOpenChange} sidebarOpen />);
    await user.click(screen.getByRole("button", { name: "Open or close the sidebar" }));
    expect(onSidebarOpenChange).toHaveBeenCalledWith(false);
  });

  it("can start with the sidebar closed", () => {
    const { container } = render(<ClosedSidebar />);
    expect(container.querySelector("[data-state='collapsed']")).not.toBeNull();
  });

  it("leaves room for the bottom bar", () => {
    render(<Playground />);
    expect(screen.getByRole("main").className).toContain("var(--bottom-nav-height,0px)");
  });

  it("swaps the page with a transition when the key changes", async () => {
    const { rerender } = render(<Playground transitionKey="/a" children={<p>Page A</p>} />);
    expect(screen.getByText("Page A")).toBeInTheDocument();

    rerender(<Playground transitionKey="/b" children={<p>Page B</p>} />);

    expect(await screen.findByText("Page B")).toBeInTheDocument();
    await vi.waitFor(() => expect(screen.queryByText("Page A")).toBeNull());
    expect(screen.getByRole("main").querySelector("[data-slot='page-transition']")).not.toBeNull();
  });

  it("has no transition wrapper without a key", () => {
    render(<Playground />);
    expect(screen.getByRole("main").querySelector("[data-slot='page-transition']")).toBeNull();
  });
});
