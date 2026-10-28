import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./pie-chart.stories";

const { Playground, Donut, DonutWithTotal, WithLabels, CustomColors } = composeStories(stories);

describe("PieChart", () => {
  it("renders the chart container with a square aspect", () => {
    const { container } = render(<Playground />);
    const chart = container.querySelector("[data-slot='chart']");
    expect(chart).not.toBeNull();
    expect(chart).toHaveClass("aspect-square");
  });

  it("draws one slice per row", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll(".recharts-pie-sector")).toHaveLength(5);
  });

  it("lists every category in the legend", () => {
    render(<Playground />);
    expect(screen.getByText("Chrome")).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
  });

  it("draws a full pie by default and a ring when donut is on", () => {
    const pie = render(<Playground />);
    const pieInner = pie.container.querySelector(".recharts-pie")?.getAttribute("innerRadius");
    pie.unmount();
    const ring = render(<Donut />);
    expect(ring.container.querySelectorAll(".recharts-pie-sector")).toHaveLength(5);
    expect(pieInner).not.toBe("60");
  });

  it("prints the total inside the donut", () => {
    render(<DonutWithTotal />);
    expect(screen.getByText("925")).toBeInTheDocument();
    expect(screen.getByText("Visitors")).toBeInTheDocument();
  });

  it("does not print a centre label on a full pie", () => {
    render(<Playground />);
    expect(screen.queryByText("925")).toBeNull();
  });

  it("prints the slice labels when requested", () => {
    const { container } = render(<WithLabels />);
    expect(container.querySelector(".recharts-label-list")).not.toBeNull();
  });

  it("uses the colour given in the data", () => {
    const { container } = render(<CustomColors />);
    const fills = [...container.querySelectorAll(".recharts-pie-sector path")].map((node) =>
      node.getAttribute("fill"),
    );
    expect(fills).toEqual(["var(--chart-1)", "var(--chart-4)"]);
  });
});
