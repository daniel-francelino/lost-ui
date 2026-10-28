import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./bar-chart.stories";

const { Playground, SingleSeries, Horizontal, WithLabels, ColoredBars } = composeStories(stories);

describe("BarChart", () => {
  it("renders the chart container", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });

  it("draws one bar group per series", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll(".recharts-bar")).toHaveLength(2);
  });

  it("draws one rectangle per row for a single series", () => {
    const { container } = render(<SingleSeries />);
    expect(container.querySelectorAll(".recharts-bar-rectangle")).toHaveLength(6);
  });

  it("shows the legend when requested", () => {
    render(<Playground />);
    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("lays the categories on the y axis for horizontal bars", () => {
    const { container } = render(<Horizontal />);
    expect(container.querySelector(".recharts-yAxis")).not.toBeNull();
    expect(container.querySelector(".recharts-xAxis")).toBeNull();
  });

  it("prints the value labels when requested", () => {
    const { container } = render(<WithLabels />);
    expect(container.querySelector(".recharts-label-list")).not.toBeNull();
  });

  it("colours each bar from the color key", () => {
    const { container } = render(<ColoredBars />);
    const fills = [...container.querySelectorAll(".recharts-bar-rectangle path")].map((node) =>
      node.getAttribute("fill"),
    );
    expect(fills).toEqual(["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]);
  });
});
