import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";

import * as stories from "./chart-legend-content.stories";

const { Playground, WithIcons, TopAligned } = composeStories(stories);

const Loose = Playground as unknown as ComponentType<Record<string, unknown>>;

describe("ChartLegendContent", () => {
  it("lists every series with its configured label", () => {
    render(<Playground />);
    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("shows a coloured swatch when icons are hidden", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll("div.h-2.w-2")).toHaveLength(2);
    expect(container.querySelectorAll("svg")).toHaveLength(0);
  });

  it("shows the configured icons by default", () => {
    const { container } = render(<WithIcons />);
    expect(container.querySelectorAll("svg")).toHaveLength(2);
    expect(container.querySelectorAll("div.h-2.w-2")).toHaveLength(0);
  });

  it("renders nothing without a payload", () => {
    const { container } = render(<Loose payload={[]} />);
    expect(container.firstElementChild).toBeNull();
  });

  it("adds space above when the legend is at the bottom", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).toHaveClass("pt-3");
  });

  it("adds space below when the legend is at the top", () => {
    const { container } = render(<TopAligned />);
    expect(container.firstElementChild).toHaveClass("pb-3");
  });
});
