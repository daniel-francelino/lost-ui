import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./area-chart.stories";

const { Playground, SingleSeries, Gradient, WithYAxis, WithTooltipOptions } =
  composeStories(stories);

describe("AreaChart", () => {
  it("renders the chart container", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });

  it("draws one area per series", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelectorAll(".recharts-area")).toHaveLength(2);
  });

  it("draws a single area for a single series", () => {
    const { container } = render(<SingleSeries animate={false} />);
    expect(container.querySelectorAll(".recharts-area")).toHaveLength(1);
  });

  it("shows the legend with the series labels when requested", () => {
    render(<Playground animate={false} />);
    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("hides the legend by default", () => {
    render(<SingleSeries animate={false} />);
    expect(screen.queryByText("Desktop")).toBeNull();
  });

  it("defines one gradient per series when gradient is on", () => {
    const { container } = render(<Gradient animate={false} />);
    expect(container.querySelectorAll("linearGradient")).toHaveLength(2);
  });

  it("does not define gradients by default", () => {
    const { container } = render(<Playground animate={false} />);
    expect(container.querySelectorAll("linearGradient")).toHaveLength(0);
  });

  it("adds the y axis only when requested", () => {
    const withAxis = render(<WithYAxis animate={false} />);
    expect(withAxis.container.querySelector(".recharts-yAxis")).not.toBeNull();
    withAxis.unmount();
    const without = render(<Playground animate={false} />);
    expect(without.container.querySelector(".recharts-yAxis")).toBeNull();
  });

  it("formats the x axis ticks", () => {
    render(<Playground animate={false} />);
    expect(screen.getByText("Jan")).toBeInTheDocument();
  });

  it("accepts tooltip options and a minimum tick gap", () => {
    const { container } = render(<WithTooltipOptions animate={false} />);
    expect(container.querySelectorAll(".recharts-area")).toHaveLength(2);
  });
});
