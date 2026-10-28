import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./chart.stories";

const { Playground, WithThemeColors } = composeStories(stories);

describe("ChartContainer", () => {
  it("renders the chart wrapper", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
  });

  it("exposes each series color as a CSS variable", () => {
    const { container } = render(<Playground />);
    const css = container.querySelector("style")?.textContent ?? "";
    expect(css).toContain("--color-desktop: var(--chart-1)");
    expect(css).toContain("--color-mobile: var(--chart-2)");
  });

  it("scopes light and dark theme colors separately", () => {
    const { container } = render(<WithThemeColors />);
    const css = container.querySelector("style")?.textContent ?? "";
    expect(css).toContain("--color-desktop: oklch(0.6 0.2 250)");
    expect(css).toContain(".dark");
    expect(css).toContain("--color-desktop: oklch(0.8 0.15 250)");
  });

  it("gives each chart its own scoped id", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-chart]")?.getAttribute("data-chart")).toMatch(/^chart-/);
  });
});
