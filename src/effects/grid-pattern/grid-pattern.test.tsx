import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./grid-pattern.stories";

const { Playground } = composeStories(stories);

describe("GridPattern", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws one rect per highlighted square", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll("svg rect").length).toBeGreaterThanOrEqual(4);
  });
});

describe("grid-pattern stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
