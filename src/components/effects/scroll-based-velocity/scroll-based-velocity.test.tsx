import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./scroll-based-velocity.stories";

const { Playground } = composeStories(stories);

describe("ScrollVelocity", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders both rows", () => {
    const { container } = render(<Playground />);
    expect(container.textContent).toContain("Scroll velocity");
    expect(container.textContent).toContain("Another row");
  });
});

describe("scroll-based-velocity stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
