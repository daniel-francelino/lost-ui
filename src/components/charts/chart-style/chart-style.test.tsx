import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ChartStyle } from "./chart-style";
import * as stories from "./chart-style.stories";

const { Playground } = composeStories(stories);

describe("ChartStyle", () => {
  it("defines one variable per series color", () => {
    const { container } = render(<Playground />);
    const css = container.querySelector("style")?.textContent ?? "";
    expect(css).toContain("--color-desktop: var(--chart-1)");
    expect(css).toContain("--color-mobile: var(--chart-2)");
  });

  it("targets the chart by its id", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("style")?.textContent).toContain("[data-chart=chart-demo]");
  });

  it("emits a separate dark block", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("style")?.textContent).toContain(
      ".dark [data-chart=chart-demo]",
    );
  });

  it("renders nothing when no series has a color", () => {
    const { container } = render(
      <ChartStyle id="empty" config={{ desktop: { label: "Desktop" } }} />,
    );
    expect(container.querySelector("style")).toBeNull();
  });
});
