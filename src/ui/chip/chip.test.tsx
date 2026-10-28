import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./chip.stories";

const {
  Playground,
  WithText,
  WithLabel,
  Colors,
  Sizes,
  Positions,
  InsetOnAvatar,
  Standalone,
  Hidden,
} = composeStories(stories);

const chips = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLElement>('[data-slot="chip"]'),
];

describe("Chip", () => {
  it("draws a dot on the element it wraps", () => {
    const { container } = render(<Playground />);
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(chips(container)).toHaveLength(1);
    expect(chips(container)[0]).toHaveClass("size-2.5", "bg-primary");
  });

  it("puts the chip outside the corner by default", () => {
    const { container } = render(<Playground />);
    expect(chips(container)[0]).toHaveClass(
      "absolute",
      "right-0",
      "top-0",
      "translate-x-1/2",
      "-translate-y-1/2",
    );
  });

  it("shows a text and grows to hold it", () => {
    const { container } = render(<WithText />);
    expect(chips(container)[0]).toHaveTextContent("5");
    expect(chips(container)[0]).toHaveClass("min-w-6");
  });

  it("names the chip for screen readers", () => {
    render(<WithLabel />);
    expect(screen.getByText("unread")).toHaveClass("sr-only");
  });

  it("applies each colour", () => {
    const { container } = render(<Colors />);
    const all = chips(container);
    expect(all[0]).toHaveClass("bg-primary");
    expect(all[2]).toHaveClass("bg-success");
    expect(all[5]).toHaveClass("bg-destructive");
    expect(all[6]).toHaveClass("bg-foreground");
  });

  it("applies each size", () => {
    const { container } = render(<Sizes />);
    const all = chips(container);
    expect(all[0]).toHaveClass("size-1.5");
    expect(all[6]).toHaveClass("size-5");
  });

  it("applies each corner", () => {
    const { container } = render(<Positions />);
    expect(chips(container).map((chip) => chip.dataset["position"])).toEqual([
      "top-right",
      "bottom-right",
      "top-left",
      "bottom-left",
    ]);
    expect(chips(container)[1]).toHaveClass("bottom-0", "right-0");
    expect(chips(container)[2]).toHaveClass("left-0", "top-0");
  });

  it("stays inside the corner with inset", () => {
    const { container } = render(<InsetOnAvatar />);
    expect(chips(container)[0]).not.toHaveClass("translate-x-1/2");
    expect(chips(container)[0]).toHaveClass("bg-success");
  });

  it("stands alone in the flow", () => {
    const { container } = render(<Standalone />);
    expect(chips(container)[0]).toHaveClass("relative");
    expect(chips(container)[0]).not.toHaveClass("absolute");
    expect(chips(container)[0]).toHaveTextContent("New");
  });

  it("can be hidden and keeps what it wraps", () => {
    const { container } = render(<Hidden />);
    expect(chips(container)).toHaveLength(0);
    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
  });

  it("takes custom content instead of the text", () => {
    const { container } = render(<Playground content={<b>!</b>} text="ignored" />);
    expect(chips(container)[0]).toHaveTextContent("!");
    expect(chips(container)[0]).not.toHaveTextContent("ignored");
  });
});
