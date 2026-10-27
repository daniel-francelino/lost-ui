import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./morphing-text.stories";

const { Playground } = composeStories(stories);

describe("MorphingText", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders both morphing layers", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll("span").length).toBeGreaterThanOrEqual(2);
  });
});

describe("morphing-text stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
