import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./interactive-hover-button.stories";

const { Playground } = composeStories(stories);

describe("InteractiveHoverButton", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows its label", () => {
    render(<Playground />);
    expect(screen.getAllByText("Hover me").length).toBeGreaterThan(0);
  });
});

describe("interactive-hover-button stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
