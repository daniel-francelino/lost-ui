import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./video-text.stories";

const { Playground } = composeStories(stories);

describe("VideoText", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("uses the video as the text mask", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("video")).not.toBeNull();
  });
});

describe("video-text stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
