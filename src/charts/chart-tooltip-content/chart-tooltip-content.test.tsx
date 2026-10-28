import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { describe, expect, it } from "vitest";

import * as stories from "./chart-tooltip-content.stories";

const { Playground, LineIndicator, DashedIndicator, HiddenLabel, HiddenIndicator, SingleItem } =
  composeStories(stories);

const Loose = Playground as unknown as ComponentType<Record<string, unknown>>;

describe("ChartTooltipContent", () => {
  it("shows the label and one row per series", () => {
    render(<Playground />);
    expect(screen.getByText("January")).toBeInTheDocument();
    expect(screen.getByText("Desktop")).toBeInTheDocument();
    expect(screen.getByText("Mobile")).toBeInTheDocument();
  });

  it("prints the values", () => {
    render(<Playground />);
    expect(screen.getByText("186")).toBeInTheDocument();
    expect(screen.getByText("80")).toBeInTheDocument();
  });

  it("renders nothing when it is not active", () => {
    const { container } = render(<Loose active={false} />);
    expect(container.firstElementChild).toBeNull();
  });

  it("renders nothing without a payload", () => {
    const { container } = render(<Loose payload={[]} />);
    expect(container.firstElementChild).toBeNull();
  });

  it("hides the label when asked", () => {
    render(<HiddenLabel />);
    expect(screen.queryByText("January")).toBeNull();
  });

  it("uses the line indicator", () => {
    const { container } = render(<LineIndicator />);
    expect(container.querySelector(".w-1")).not.toBeNull();
  });

  it("uses the dashed indicator", () => {
    const { container } = render(<DashedIndicator />);
    expect(container.querySelector(".border-dashed")).not.toBeNull();
  });

  it("uses the dot indicator by default", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll(".h-2\\.5.w-2\\.5")).toHaveLength(2);
  });

  it("hides the indicator when asked", () => {
    const { container } = render(<HiddenIndicator />);
    expect(container.querySelector(".h-2\\.5.w-2\\.5")).toBeNull();
  });

  it("nests the label next to a single item with a non dot indicator", () => {
    render(<SingleItem />);
    expect(screen.getAllByText("January")).toHaveLength(1);
    expect(screen.getByText("Desktop")).toBeInTheDocument();
  });

  it("uses a custom formatter for the values", () => {
    render(
      <Loose
        formatter={(value: unknown) => (
          <span data-testid="custom">{`${String(value)} visits`}</span>
        )}
      />,
    );
    expect(screen.getAllByTestId("custom")[0]).toHaveTextContent("186 visits");
  });
});
