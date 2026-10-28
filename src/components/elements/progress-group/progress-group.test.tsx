import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./progress-group.stories";

const {
  Playground,
  WithStatus,
  CustomStatus,
  CustomColors,
  NoLegend,
  OverMax,
  Sizes,
  Vertical,
  CustomLegend,
} = composeStories(stories);

const segments = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLElement>('[data-slot="progress-group-segment"]'),
];

describe("ProgressGroup", () => {
  it("is a progress bar with the sum of the items", () => {
    render(<Playground />);
    const bar = screen.getByRole("progressbar", { name: "Storage" });
    expect(bar).toHaveAttribute("aria-valuenow", "70");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
  });

  it("gives each item a segment as wide as its share of the total", () => {
    const { container } = render(<Playground />);
    expect(segments(container).map((segment) => segment.style.width)).toEqual([
      "30%",
      "25%",
      "15%",
    ]);
  });

  it("colours a segment from the theme", () => {
    const { container } = render(<Playground />);
    expect(segments(container)[0]).toHaveClass("bg-primary");
    expect(segments(container)[1]).toHaveClass("bg-success");
  });

  it("takes any CSS colour", () => {
    const { container } = render(<CustomColors />);
    expect(segments(container)[0]?.style.background).toContain("rgb(79, 70, 229)");
    expect(segments(container)[0]).not.toHaveClass("bg-primary");
  });

  it("uses the colour of the group for items without one", () => {
    const { container } = render(<Playground color="info" items={[{ label: "A", value: 10 }]} />);
    expect(segments(container)[0]).toHaveClass("bg-info");
  });

  it("lists the items with their label and value", () => {
    render(<Playground />);
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("shows a dot in the colour of an item without an icon", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("li span.rounded-full")).toHaveClass("bg-primary");
  });

  it("shows the icon of an item instead of the dot", () => {
    const { container } = render(
      <Playground items={[{ label: "A", value: 1, icon: <i data-testid="icon" /> }]} />,
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(container.querySelector("li span.rounded-full")).toBeNull();
  });

  it("hides the list without a legend", () => {
    render(<NoLegend />);
    expect(screen.queryByRole("list")).toBeNull();
  });

  it("shows the sum as a percentage with status", () => {
    render(<WithStatus />);
    expect(screen.getByText("70%")).toBeInTheDocument();
  });

  it("lets the app write the status", () => {
    render(<CustomStatus />);
    expect(screen.getByText("70 of 100 GB used (70%)")).toBeInTheDocument();
  });

  it("shows no status by default", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector('[data-slot="progress-group-status"]')).toBeNull();
  });

  it("shares the track in proportion when the items go over the total", () => {
    const { container } = render(<OverMax />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    const widths = segments(container).map((segment) => Number.parseFloat(segment.style.width));
    expect(widths[0]).toBeCloseTo(57.14, 1);
    expect(widths[1]).toBeCloseTo(42.86, 1);
  });

  it("clamps a negative value to zero and one over the total to the total", () => {
    const { container } = render(
      <Playground
        items={[
          { label: "A", value: -5 },
          { label: "B", value: 500 },
        ]}
      />,
    );
    expect(segments(container).map((segment) => segment.style.width)).toEqual(["0%", "100%"]);
  });

  it("applies each size", () => {
    render(<Sizes />);
    const bars = screen.getAllByRole("progressbar");
    expect(bars[0]).toHaveClass("h-0.5");
    expect(bars[3]).toHaveClass("h-2");
    expect(bars[6]).toHaveClass("h-5");
  });

  it("draws the segments by height when vertical", () => {
    const { container } = render(<Vertical />);
    expect(screen.getByRole("progressbar")).toHaveClass("flex-col-reverse", "w-3");
    expect(segments(container)[0]?.style.height).toBe("30%");
  });

  it("lets the app draw the label and the end of an item", () => {
    render(<CustomLegend />);
    expect(screen.getByText("(30%)")).toBeInTheDocument();
    expect(screen.getByText("30 GB")).toBeInTheDocument();
  });

  it("handles a total of zero", () => {
    render(<WithStatus max={0} items={[{ label: "A", value: 0 }]} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });
});
