import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./shine-border.stories";

const { Playground } = composeStories(stories);

describe("ShineBorder", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("joins the colours into one gradient", () => {
    const { container } = render(<Playground />);
    expect(container.innerHTML).toContain("var(--effect-from)");
  });
});

describe("shine-border stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
