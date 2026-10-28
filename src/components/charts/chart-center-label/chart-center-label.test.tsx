import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChartCenterLabel } from "./chart-center-label";
import * as stories from "./chart-center-label.stories";

const { Playground, WithoutCaption } = composeStories(stories);

describe("ChartCenterLabel", () => {
  it("prints a number with thousands separators", () => {
    render(<Playground />);
    expect(screen.getByText((1260).toLocaleString())).toBeInTheDocument();
  });

  it("prints the caption below the value", () => {
    render(<Playground />);
    expect(screen.getByText("Visitors")).toBeInTheDocument();
  });

  it("prints text values as they are", () => {
    render(<WithoutCaption />);
    expect(screen.getByText("98%")).toBeInTheDocument();
  });

  it("omits the caption when there is none", () => {
    const { container } = render(<WithoutCaption />);
    expect(container.querySelectorAll("tspan")).toHaveLength(1);
  });

  it("centres the text on the view box", () => {
    const { container } = render(<Playground />);
    const text = container.querySelector("text");
    expect(text?.getAttribute("x")).toBe("100");
    expect(text?.getAttribute("y")).toBe("90");
  });

  it("renders nothing without a centre", () => {
    const { container } = render(
      <svg>
        <ChartCenterLabel value={1} viewBox={{ width: 10 }} />
      </svg>,
    );
    expect(container.querySelector("text")).toBeNull();
  });
});
