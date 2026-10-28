import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./radar-chart.stories";

const { Playground, SingleSeries, CircleGrid, LinesOnly, WithRadiusAxis } = composeStories(stories);

describe("RadarChart", () => {
  it("renders the chart container with a square aspect", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-slot='chart']")).toHaveClass("aspect-square");
  });

  it("draws one radar per series", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll(".recharts-radar")).toHaveLength(2);
    const single = render(<SingleSeries />);
    expect(single.container.querySelectorAll(".recharts-radar")).toHaveLength(1);
  });

  it("labels the angle axis with the categories", () => {
    render(<Playground />);
    expect(screen.getByText("January")).toBeInTheDocument();
    expect(screen.getByText("June")).toBeInTheDocument();
  });

  it("uses a circular grid when asked", () => {
    const polygon = render(<Playground />);
    expect(
      polygon.container.querySelector(".recharts-polar-grid-concentric-polygon"),
    ).not.toBeNull();
    polygon.unmount();
    const circle = render(<CircleGrid />);
    expect(circle.container.querySelector(".recharts-polar-grid-concentric-circle")).not.toBeNull();
  });

  it("draws dots on each vertex when requested", () => {
    const { container } = render(<CircleGrid />);
    expect(container.querySelectorAll(".recharts-radar-dots circle").length).toBeGreaterThan(0);
  });

  it("shows the legend when requested", () => {
    render(<LinesOnly />);
    expect(screen.getByText("Desktop")).toBeInTheDocument();
  });

  it("adds the radius axis only when requested", () => {
    const withAxis = render(<WithRadiusAxis />);
    expect(withAxis.container.querySelector(".recharts-polar-radius-axis")).not.toBeNull();
    withAxis.unmount();
    const without = render(<Playground />);
    expect(without.container.querySelector(".recharts-polar-radius-axis")).toBeNull();
  });
});
