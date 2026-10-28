import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./pie-chart.examples.stories";

describe("Pie charts", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.querySelector("[data-slot='chart']")).not.toBeNull();
    expect(container.querySelector(".recharts-surface")).not.toBeNull();
  });
});
