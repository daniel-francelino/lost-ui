import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./glyph-matrix.stories";

const { Playground } = composeStories(stories);

describe("GlyphMatrix", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws on a canvas", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});

describe("glyph-matrix stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
