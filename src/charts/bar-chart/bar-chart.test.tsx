import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./bar-chart.stories";

const {
  Playground,
  SingleSeries,
  Horizontal,
  WithLabels,
  ColoredBars,
  Highlighted,
  NegativeValues,
  CategoryInside,
  WithTooltipOptions,
} = composeStories(stories);

describe("BarChart", () => {
  it("renders the chart container", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });

  it("draws one bar group per series", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelectorAll(".recharts-bar")).toHaveLength(2);
  });

  it("draws one rectangle per row for a single series", () => {
    const { container } = render(<SingleSeries animate={false} />);
    expect(container.querySelectorAll(".recharts-bar-rectangle")).toHaveLength(6);
  });

  it("shows the legend when requested", () => {
    render(<Playground animate={false} />);
    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("lays the categories on the y axis for horizontal bars", () => {
    const { container } = render(<Horizontal animate={false} />);
    expect(container.querySelector(".recharts-yAxis")).not.toBeNull();
    expect(container.querySelector(".recharts-xAxis")).toBeNull();
  });

  it("prints the value labels when requested", () => {
    const { container } = render(<WithLabels animate={false} />);
    expect(container.querySelector(".recharts-label-list")).not.toBeNull();
  });

  it("colours each bar from the color key", () => {
    const { container } = render(<ColoredBars animate={false} />);
    const fills = [...container.querySelectorAll(".recharts-bar-rectangle path")].map((node) =>
      node.getAttribute("fill"),
    );
    expect(fills).toEqual(["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]);
  });

  it("highlights the active bar with a dashed outline", () => {
    const { container } = render(<Highlighted animate={false} />);
    const dashed = container.querySelectorAll(".recharts-bar-rectangle path[stroke-dasharray]");
    expect(dashed).toHaveLength(1);
  });

  it("does not outline any bar by default", () => {
    const { container } = render(<SingleSeries animate={false} />);
    expect(
      container.querySelectorAll(".recharts-bar-rectangle path[stroke-dasharray]"),
    ).toHaveLength(0);
  });

  it("paints negative values with the negative color", () => {
    const { container } = render(<NegativeValues animate={false} />);
    const fills = [...container.querySelectorAll(".recharts-bar-rectangle path")].map((node) =>
      node.getAttribute("fill"),
    );
    expect(fills).toEqual(["var(--color-desktop)", "var(--chart-2)", "var(--color-desktop)"]);
  });

  it("labels the bars with the label key", () => {
    const { container } = render(<NegativeValues animate={false} />);
    const labels = container.querySelector(".recharts-label-list")?.textContent;
    expect(labels).toBe("JanuaryFebruaryMarch");
  });

  it("prints the category inside the bar and hides the y axis", () => {
    const { container } = render(<CategoryInside animate={false} />);
    expect(container.querySelector(".recharts-yAxis")).toBeNull();
    expect(container.textContent).toContain("Jan");
  });

  it("accepts tooltip options", () => {
    const { container } = render(<WithTooltipOptions animate={false} />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });
});
