import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./striped-pattern.stories";

const { Playground } = composeStories(stories);

describe("StripedPattern", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("defines a repeating pattern", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("svg pattern")).not.toBeNull();
  });
});

describe("striped-pattern stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
