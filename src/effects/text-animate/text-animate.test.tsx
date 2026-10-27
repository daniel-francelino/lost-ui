import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./text-animate.stories";

const { Playground, ByCharacter } = composeStories(stories);

describe("TextAnimate", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the by character story", () => {
    const { container } = render(<ByCharacter />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("splits the text by word", () => {
    const { container } = render(<Playground />);
    expect(container.textContent).toContain("Animated text from lost-ui");
  });
});

describe("text-animate stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
