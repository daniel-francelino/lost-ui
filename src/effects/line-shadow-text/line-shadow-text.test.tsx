import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./line-shadow-text.stories";

const { Playground } = composeStories(stories);

describe("LineShadowText", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the text", () => {
    const { container } = render(<Playground />);
    expect(container.textContent).toContain("Shadow");
  });
});

describe("line-shadow-text stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
