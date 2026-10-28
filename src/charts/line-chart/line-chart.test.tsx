import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./line-chart.stories";

const { Playground, SingleSeries, WithDots, WithLabels } = composeStories(stories);

describe("LineChart", () => {
  it("renders the chart container", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });

  it("draws one line per series", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll(".recharts-line")).toHaveLength(2);
  });

  it("draws a single line for a single series", () => {
    const { container } = render(<SingleSeries />);
    expect(container.querySelectorAll(".recharts-line")).toHaveLength(1);
  });

  it("shows the legend when requested", () => {
    render(<Playground />);
    expect(screen.getByText("Desktop")).toBeInTheDocument();
  });

  it("draws a dot per point only when dots are on", () => {
    const withDots = render(<WithDots />);
    expect(withDots.container.querySelectorAll(".recharts-line-dot").length).toBe(12);
    withDots.unmount();
    const without = render(<SingleSeries />);
    expect(without.container.querySelectorAll(".recharts-line-dot")).toHaveLength(0);
  });

  it("prints the value labels when requested", () => {
    const { container } = render(<WithLabels />);
    expect(container.querySelector(".recharts-label-list")).not.toBeNull();
  });
});
