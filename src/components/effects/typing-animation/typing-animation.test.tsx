import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./typing-animation.stories";

const { Playground, RotatingWords } = composeStories(stories);

describe("TypingAnimation", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the rotating words story", () => {
    const { container } = render(<RotatingWords />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows a cursor while typing", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });
});

describe("typing-animation stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
