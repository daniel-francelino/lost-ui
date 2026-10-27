import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./hyper-text.stories";

const { Playground } = composeStories(stories);

describe("HyperText", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders one element per character", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll("span").length).toBeGreaterThanOrEqual(9);
  });
});

describe("hyper-text stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
