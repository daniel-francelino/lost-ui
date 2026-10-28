import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./button-group.stories";

const { Playground, Vertical, Sizes, WithInput, WithBadge, Split } = composeStories(stories);

describe("ButtonGroup", () => {
  it("is a labelled group of its controls", () => {
    render(<Playground />);
    const group = screen.getByRole("group", { name: "Alignment" });
    expect(group.querySelectorAll("button")).toHaveLength(3);
  });

  it("squares the inner corners and overlaps the borders", () => {
    render(<Playground />);
    expect(screen.getByRole("group")).toHaveClass(
      "[&>*:not(:first-child)]:rounded-l-none",
      "[&>*:not(:last-child)]:rounded-r-none",
      "[&>*:not(:first-child)]:-ml-px",
    );
  });

  it("stacks the controls when vertical", () => {
    render(<Vertical />);
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-orientation", "vertical");
    expect(group).toHaveClass("flex-col", "[&>*:not(:first-child)]:rounded-t-none");
  });

  it("is horizontal by default", () => {
    render(<Playground />);
    expect(screen.getByRole("group")).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("group")).not.toHaveClass("flex-col");
  });

  it("sizes every control from the group", () => {
    render(<Sizes />);
    const groups = screen.getAllByRole("group");
    expect(groups[0]).toHaveClass("[&>*]:h-7");
    expect(groups[4]).toHaveClass("[&>*]:h-12");
  });

  it("leaves the size of the controls alone without a size", () => {
    render(<Playground />);
    expect(screen.getByRole("group").className).not.toContain("[&>*]:h-");
  });

  it("joins an input and a button", () => {
    render(<WithInput />);
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("joins a badge and an input", () => {
    render(<WithBadge />);
    expect(screen.getByText("https://")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Domain" })).toBeInTheDocument();
  });

  it("joins a button with a menu button", () => {
    render(<Split />);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More options" })).toBeInTheDocument();
  });

  it("takes another role and keeps a class from the app", () => {
    render(<Playground role="toolbar" className="gap-0" />);
    expect(screen.getByRole("toolbar")).toHaveClass("gap-0");
  });
});
