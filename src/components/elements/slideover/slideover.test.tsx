import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import * as stories from "./slideover.stories";

const { Playground, Left, Top, Bottom, Inset, WithFooter, NonModal } = composeStories(stories);

describe("Slideover", () => {
  it("opens from its trigger as a dialog with the title and the description", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await user.click(screen.getByRole("button", { name: "Open" }));

    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    expect(dialog).toHaveAccessibleDescription("Narrow the list down.");
  });

  it("slides in from the right by default", () => {
    render(<Playground defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "right");
    expect(screen.getByRole("dialog")).toHaveClass("right-0", "h-full", "border-l");
  });

  it.each([
    ["left", Left, ["left-0", "border-r"]],
    ["top", Top, ["top-0", "border-b", "w-full"]],
    ["bottom", Bottom, ["bottom-0", "border-t", "w-full"]],
  ] as const)("slides in from the %s", (side, Story, classes) => {
    render(<Story defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", side);
    expect(screen.getByRole("dialog")).toHaveClass(...classes);
  });

  it("floats away from the edges when inset", () => {
    render(<Inset defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveClass("right-2", "rounded-lg");
  });

  it("closes from the footer", async () => {
    const user = userEvent.setup();
    render(<WithFooter defaultOpen />);

    await user.click(screen.getByRole("button", { name: "Apply" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes with Escape and with the close button", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Playground defaultOpen />);
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    unmount();

    render(<Playground defaultOpen />);
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("leaves the page usable and draws no backdrop when not modal", () => {
    render(<NonModal defaultOpen />);
    expect(document.querySelector('[data-slot="modal-overlay"]')).toBeNull();
  });
});
