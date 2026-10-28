import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./radar-chart.stories";

const {
  Playground,
  SingleSeries,
  CircleGrid,
  LinesOnly,
  WithRadiusAxis,
  WithoutGrid,
  FilledGrid,
  NoRadialLines,
  SingleRing,
  CustomAngleLabels,
} = composeStories(stories);

describe("RadarChart", () => {
  it("renders the chart container with a square aspect", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelector("[data-slot='chart']")).toHaveClass("aspect-square");
  });

  it("draws one radar per series", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelectorAll(".recharts-radar")).toHaveLength(2);
    const single = render(<SingleSeries animate={false} />);
    expect(single.container.querySelectorAll(".recharts-radar")).toHaveLength(1);
  });

  it("labels the angle axis with the categories", () => {
    render(<Playground animate={false} />);
    expect(screen.getByText("January")).toBeInTheDocument();
    expect(screen.getByText("June")).toBeInTheDocument();
  });

  it("uses a circular grid when asked", () => {
    const polygon = render(<Playground animate={false} />);
    expect(
      polygon.container.querySelector(".recharts-polar-grid-concentric-polygon"),
    ).not.toBeNull();
    polygon.unmount();
    const circle = render(<CircleGrid animate={false} />);
    expect(circle.container.querySelector(".recharts-polar-grid-concentric-circle")).not.toBeNull();
  });

  it("draws dots on each vertex when requested", () => {
    const { container } = render(<CircleGrid animate={false} />);
    expect(container.querySelectorAll(".recharts-radar-dots circle").length).toBeGreaterThan(0);
  });

  it("shows the legend when requested", () => {
    render(<LinesOnly animate={false} />);
    expect(screen.getByText("Desktop")).toBeInTheDocument();
  });

  it("adds the radius axis only when requested", () => {
    const withAxis = render(<WithRadiusAxis animate={false} />);
    expect(withAxis.container.querySelector(".recharts-polar-radius-axis")).not.toBeNull();
    withAxis.unmount();
    const without = render(<Playground animate={false} />);
    expect(without.container.querySelector(".recharts-polar-radius-axis")).toBeNull();
  });

  it("removes the grid", () => {
    const { container } = render(<WithoutGrid animate={false} />);
    expect(container.querySelector(".recharts-polar-grid")).toBeNull();
  });

  it("fills the grid with the series color", () => {
    const { container } = render(<FilledGrid animate={false} />);
    expect(
      container.querySelector(".recharts-polar-grid-concentric-polygon")?.getAttribute("class"),
    ).toContain("fill-(--color-desktop)");
  });

  it("draws radial lines by default and omits them on request", () => {
    const withLines = render(<Playground animate={false} />);
    expect(withLines.container.querySelector(".recharts-polar-grid-angle")).not.toBeNull();
    withLines.unmount();
    const without = render(<NoRadialLines animate={false} />);
    expect(without.container.querySelector(".recharts-polar-grid-angle line")).toBeNull();
  });

  it("draws one ring for a single grid radius", () => {
    const { container } = render(<SingleRing animate={false} />);
    expect(container.querySelectorAll(".recharts-polar-grid-concentric-polygon")).toHaveLength(1);
  });

  it("renders the custom angle labels", () => {
    render(<CustomAngleLabels animate={false} />);
    expect(screen.getAllByTestId("angle-tick")).toHaveLength(6);
    expect(screen.getAllByText("Jan").length).toBeGreaterThan(0);
  });
});
