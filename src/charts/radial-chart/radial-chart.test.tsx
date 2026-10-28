import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./radial-chart.stories";

const { Playground, WithGrid, WithLabels, WithCenterLabel } = composeStories(stories);

describe("RadialChart", () => {
  it("renders the chart container with a square aspect", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-slot='chart']")).toHaveClass("aspect-square");
  });

  it("draws one bar per row", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll(".recharts-radial-bar-sector")).toHaveLength(5);
  });

  it("draws the circular grid only when requested", () => {
    const withGrid = render(<WithGrid />);
    expect(withGrid.container.querySelector(".recharts-polar-grid")).not.toBeNull();
    withGrid.unmount();
    const without = render(<Playground />);
    expect(without.container.querySelector(".recharts-polar-grid")).toBeNull();
  });

  it("prints the category labels on the bars when requested", () => {
    const { container } = render(<WithLabels />);
    expect(container.querySelector(".recharts-label-list")).not.toBeNull();
  });

  it("prints the centre label", () => {
    render(<WithCenterLabel />);
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("Visitors")).toBeInTheDocument();
  });
});
