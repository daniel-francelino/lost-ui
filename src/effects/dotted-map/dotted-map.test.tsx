import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./dotted-map.stories";

const { Playground } = composeStories(stories);

describe("DottedMap", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws the map as an svg", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});

describe("dotted-map stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
