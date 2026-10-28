import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./pie-chart.stories";

const {
  Playground,
  Donut,
  DonutWithTotal,
  WithLabels,
  CustomColors,
  OutsideLabels,
  FormattedOutsideLabels,
  WithoutSeparator,
  Highlighted,
  TwoRings,
  ConfigLabels,
} = composeStories(stories);

describe("PieChart", () => {
  it("renders the chart container with a square aspect", () => {
    const { container } = render(<Playground animate={false} />);
    const chart = container.querySelector("[data-slot='chart']");
    expect(chart).not.toBeNull();
    expect(chart).toHaveClass("aspect-square");
  });

  it("draws one slice per row", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelectorAll(".recharts-pie-sector")).toHaveLength(5);
  });

  it("lists every category in the legend, in the order of the data", async () => {
    const { container } = render(<Playground animate={false} />);
    await screen.findByText("Chrome");
    const legend = container.querySelector(".recharts-legend-wrapper")?.textContent;
    expect(legend).toBe("ChromeSafariFirefoxEdgeOther");
  });

  it("draws a full pie by default and a ring when donut is on", () => {
    const pie = render(<Playground animate={false} />);
    const pieInner = pie.container.querySelector(".recharts-pie")?.getAttribute("innerRadius");
    pie.unmount();
    const ring = render(<Donut animate={false} />);
    expect(ring.container.querySelectorAll(".recharts-pie-sector")).toHaveLength(5);
    expect(pieInner).not.toBe("60");
  });

  it("prints the total inside the donut", () => {
    render(<DonutWithTotal animate={false} />);
    expect(screen.getByText("925")).toBeInTheDocument();
    expect(screen.getByText("Visitors")).toBeInTheDocument();
  });

  it("does not print a centre label on a full pie", () => {
    render(<Playground animate={false} />);
    expect(screen.queryByText("925")).toBeNull();
  });

  it("prints the slice labels when requested", () => {
    const { container } = render(<WithLabels animate={false} />);
    expect(container.querySelector(".recharts-label-list")).not.toBeNull();
  });

  it("uses the colour given in the data", () => {
    const { container } = render(<CustomColors animate={false} />);
    const fills = [...container.querySelectorAll(".recharts-pie-sector path")].map((node) =>
      node.getAttribute("fill"),
    );
    expect(fills).toEqual(["var(--chart-1)", "var(--chart-4)"]);
  });

  it("prints the values outside the slices", () => {
    const { container } = render(<OutsideLabels animate={false} />);
    expect(container.querySelectorAll(".recharts-pie-label-text")).toHaveLength(5);
  });

  it("formats the outside labels", () => {
    const { container } = render(<FormattedOutsideLabels animate={false} />);
    expect(container.textContent).toContain("275 visits");
  });

  it("removes the separator between slices", () => {
    const { container } = render(<WithoutSeparator animate={false} />);
    const strokes = [...container.querySelectorAll(".recharts-pie-sector path")].map((node) =>
      node.getAttribute("stroke"),
    );
    expect(strokes.every((value) => value === "none")).toBe(true);
  });

  it("draws every slice when one is highlighted", () => {
    const { container } = render(<Highlighted animate={false} />);
    expect(container.querySelectorAll(".recharts-pie-sector")).toHaveLength(5);
  });

  it("draws a second ring when an inner ring is given", () => {
    const { container } = render(<TwoRings animate={false} />);
    expect(container.querySelectorAll(".recharts-pie")).toHaveLength(2);
  });

  it("uses the config labels in the legend", async () => {
    render(<ConfigLabels animate={false} />);
    expect(await screen.findByText("Google Chrome")).toBeInTheDocument();
    expect(screen.getByText("Apple Safari")).toBeInTheDocument();
  });
});
