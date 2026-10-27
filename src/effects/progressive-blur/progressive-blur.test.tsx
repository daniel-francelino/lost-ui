import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./progressive-blur.stories";

const { Playground } = composeStories(stories);

describe("ProgressiveBlur", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the stacked blur layers", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll("div").length).toBeGreaterThan(5);
  });
});

describe("progressive-blur stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
