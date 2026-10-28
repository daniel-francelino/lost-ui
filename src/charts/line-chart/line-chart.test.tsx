import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./line-chart.stories";

const { Playground, SingleSeries, WithDots, WithLabels, ColoredDots, CustomDots, FormattedLabels } =
  composeStories(stories);

describe("LineChart", () => {
  it("renders the chart container", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });

  it("draws one line per series", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelectorAll(".recharts-line")).toHaveLength(2);
  });

  it("draws a single line for a single series", () => {
    const { container } = render(<SingleSeries animate={false} />);
    expect(container.querySelectorAll(".recharts-line")).toHaveLength(1);
  });

  it("shows the legend when requested", () => {
    render(<Playground animate={false} />);
    expect(screen.getByText("Desktop")).toBeInTheDocument();
  });

  it("draws a dot per point only when dots are on", () => {
    const withDots = render(<WithDots animate={false} />);
    expect(withDots.container.querySelectorAll(".recharts-line-dot").length).toBe(12);
    withDots.unmount();
    const without = render(<SingleSeries animate={false} />);
    expect(without.container.querySelectorAll(".recharts-line-dot")).toHaveLength(0);
  });

  it("prints the value labels when requested", () => {
    const { container } = render(<WithLabels animate={false} />);
    expect(container.querySelector(".recharts-label-list")).not.toBeNull();
  });

  it("colours each dot from the dot color key", () => {
    const { container } = render(<ColoredDots animate={false} />);
    const fills = [...container.querySelectorAll(".recharts-dot")].map((node) =>
      node.getAttribute("fill"),
    );
    expect(fills).toEqual(["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"]);
  });

  it("renders the custom dot for every point", () => {
    render(<CustomDots animate={false} />);
    expect(screen.getAllByTestId("custom-dot").length).toBe(6);
  });

  it("formats the labels", () => {
    const { container } = render(<FormattedLabels animate={false} />);
    expect(container.querySelector(".recharts-label-list")?.textContent).toContain("JANUARY");
  });
});
