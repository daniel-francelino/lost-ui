import { composeStories } from "@storybook/react-vite";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Timeline } from "./timeline";
import * as stories from "./timeline.stories";

const {
  Playground,
  DefaultValue,
  Colors,
  Sizes,
  Horizontal,
  Reversed,
  Selectable,
  WithAvatars,
  CustomSlots,
} = composeStories(stories);

const items = () => screen.getAllByRole("listitem");

describe("Timeline", () => {
  it("lists the items with their date, title and description", () => {
    render(<Playground />);
    expect(items()).toHaveLength(4);
    expect(screen.getByText("Project kickoff")).toBeInTheDocument();
    expect(screen.getByText("Mar 15, 2026")).toBeInTheDocument();
    expect(screen.getByText("Scope and team agreed.")).toBeInTheDocument();
  });

  it("is an ordered list", () => {
    render(<Playground />);
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("marks nothing as active without a value", () => {
    render(<Playground />);
    expect(document.querySelectorAll("[data-active]")).toHaveLength(0);
  });

  it("marks the items up to the active one and flags the current step", () => {
    render(<DefaultValue />);
    const list = items();
    expect(list[0]).toHaveAttribute("data-active");
    expect(list[1]).toHaveAttribute("data-active");
    expect(list[2]).not.toHaveAttribute("data-active");
    expect(list[1]).toHaveAttribute("aria-current", "step");
    expect(list[0]).not.toHaveAttribute("aria-current");
  });

  it("colours the line only between active items", () => {
    render(<DefaultValue />);
    const lines = [...document.querySelectorAll('[data-slot="timeline-separator"]')];
    expect(lines[0]).toHaveClass("bg-primary");
    expect(lines[1]).toHaveClass("bg-border");
  });

  it("draws no line after the last item", () => {
    render(<Playground />);
    expect(document.querySelectorAll('[data-slot="timeline-separator"]')).toHaveLength(3);
  });

  it("matches the active item by its value", () => {
    render(
      <Timeline
        defaultValue="b"
        items={[
          { value: "a", title: "A" },
          { value: "b", title: "B" },
          { value: "c", title: "C" },
        ]}
      />,
    );
    expect(screen.getByText("B").closest("li")).toHaveAttribute("aria-current", "step");
  });

  it("applies the colour to the active indicators", () => {
    render(<Colors />);
    const lists = screen.getAllByRole("list");
    expect(
      within(lists[1]!).getAllByText("", { selector: "[data-slot='timeline-indicator']" })[0],
    ).toHaveClass("bg-success");
    expect(lists[5]!.querySelector("[data-slot='timeline-indicator']")).toHaveClass(
      "bg-foreground",
    );
  });

  it("applies each size", () => {
    render(<Sizes />);
    const sizes = screen
      .getAllByRole("list")
      .map((list) => list.querySelector("[data-slot='timeline-indicator']")?.className ?? "");
    expect(sizes[0]).toContain("size-5");
    expect(sizes[2]).toContain("size-8");
    expect(sizes[4]).toContain("size-12");
  });

  it("lays out horizontally", () => {
    render(<Horizontal />);
    expect(screen.getByRole("list")).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("list")).toHaveClass("flex-row");
  });

  it("reverses the direction", () => {
    render(<Reversed />);
    expect(screen.getByRole("list")).toHaveClass("flex-col-reverse");
  });

  it("is not clickable without a handler", () => {
    render(<Playground />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("makes the active item follow a click and reports it", async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Selectable onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: /Build started/ }));

    expect(items()[2]).toHaveAttribute("aria-current", "step");
    expect(onSelect.mock.calls[0]?.[0]).toMatchObject({ title: "Build started" });
  });

  it("reports the value of the clicked item", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Timeline
        onValueChange={onValueChange}
        items={[
          { value: "a", title: "A" },
          { value: "b", title: "B" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "B" }));

    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("shows an avatar in the indicator", () => {
    render(<WithAvatars />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("shows a dot when an item has no icon or avatar", () => {
    const { container } = render(<Timeline items={[{ title: "Plain" }]} />);
    expect(
      container.querySelector("[data-slot='timeline-indicator'] span.rounded-full"),
    ).not.toBeNull();
  });

  it("lets the app draw the title and the date", () => {
    render(<CustomSlots />);
    expect(screen.getByText("PROJECT KICKOFF", { exact: false }).tagName).toBe("STRONG");
    expect(screen.getByText("Mar 15, 2026").tagName).toBe("EM");
  });

  it("passes the state of the item to the slots", () => {
    const seen: boolean[] = [];
    render(
      <Timeline
        defaultValue={0}
        items={[{ title: "A" }, { title: "B" }]}
        renderTitle={(item, state) => {
          seen.push(state.active);
          return item.title;
        }}
      />,
    );
    expect(seen).toEqual([true, false, true, false].slice(0, seen.length));
    expect(seen.slice(0, 2)).toEqual([true, false]);
  });
});
