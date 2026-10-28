import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { formatKbdKey } from "./use-kbd";
import * as stories from "./kbd.stories";

const { Playground, Children, SpecialKey, Shortcut, Variants, Colors, Sizes } =
  composeStories(stories);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Kbd", () => {
  it("is a kbd element showing the value", () => {
    render(<Playground />);
    expect(screen.getByText("K").tagName).toBe("KBD");
  });

  it("shows its children instead of the value", () => {
    render(<Children />);
    expect(screen.getByText("Esc")).toBeInTheDocument();
  });

  it("shows Ctrl for meta outside a Mac", () => {
    render(<SpecialKey />);
    expect(screen.getByText("Ctrl")).toBeInTheDocument();
  });

  it("shows ⌘ for meta on a Mac", async () => {
    vi.spyOn(window.navigator, "platform", "get").mockReturnValue("MacIntel");
    render(<SpecialKey />);
    expect(await screen.findByText("⌘")).toBeInTheDocument();
  });

  it("shows several keys of a shortcut", () => {
    render(<Shortcut />);
    expect(screen.getAllByText(/Ctrl|Shift|K/)).toHaveLength(3);
  });

  it("applies each variant", () => {
    const { container } = render(<Variants />);
    const keys = [...container.querySelectorAll("kbd")];
    expect(keys[0]).toHaveClass("border");
    expect(keys[1]).toHaveClass("bg-muted");
    expect(keys[3]).toHaveClass("bg-foreground", "text-background");
  });

  it("applies each colour", () => {
    const { container } = render(<Colors />);
    const keys = [...container.querySelectorAll("kbd")];
    expect(keys[0]).toHaveClass("text-primary");
    expect(keys[2]).toHaveClass("text-success");
    expect(keys[5]).toHaveClass("text-destructive");
  });

  it("applies each size", () => {
    const { container } = render(<Sizes />);
    const keys = [...container.querySelectorAll("kbd")];
    expect(keys[0]).toHaveClass("h-4");
    expect(keys[1]).toHaveClass("h-5");
    expect(keys[2]).toHaveClass("h-6");
  });

  it("keeps a class given by the app", () => {
    render(<Playground className="rounded-full" />);
    expect(screen.getByText("K")).toHaveClass("rounded-full");
  });
});

describe("formatKbdKey", () => {
  it("writes the modifier keys for the platform", () => {
    expect(formatKbdKey("meta", true)).toBe("⌘");
    expect(formatKbdKey("meta", false)).toBe("Ctrl");
    expect(formatKbdKey("alt", true)).toBe("⌥");
    expect(formatKbdKey("alt", false)).toBe("Alt");
    expect(formatKbdKey("shift", true)).toBe("⇧");
  });

  it("ignores the case of a special key and keeps the others as they are", () => {
    expect(formatKbdKey("Enter", true)).toBe("↵");
    expect(formatKbdKey("Enter", false)).toBe("Enter");
    expect(formatKbdKey("ArrowUp", false)).toBe("↑");
    expect(formatKbdKey("K", true)).toBe("K");
  });
});
