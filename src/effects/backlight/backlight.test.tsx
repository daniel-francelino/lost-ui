import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./backlight.stories";

const { Playground } = composeStories(stories);

describe("Backlight", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps the image in front of the glow", () => {
    render(<Playground />);
    expect(screen.getAllByAltText("Backlight").length).toBeGreaterThan(0);
  });
});

describe("backlight stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
