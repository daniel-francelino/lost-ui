import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./border-beam.stories";

const { Playground } = composeStories(stories);

describe("BorderBeam", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws the beam over the card", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll("div").length).toBeGreaterThan(1);
  });
});

describe("border-beam stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
