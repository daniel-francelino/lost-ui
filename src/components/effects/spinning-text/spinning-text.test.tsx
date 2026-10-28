import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./spinning-text.stories";

const { Playground } = composeStories(stories);

describe("SpinningText", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders each letter", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll("span").length).toBeGreaterThan(10);
  });
});

describe("spinning-text stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
