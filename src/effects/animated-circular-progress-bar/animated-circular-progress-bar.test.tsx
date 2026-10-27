import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-circular-progress-bar.stories";

const { Playground } = composeStories(stories);

describe("AnimatedCircularProgressBar", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the current value", () => {
    render(<Playground />);
    expect(screen.getByText("65")).toBeInTheDocument();
  });
});

describe("animated-circular-progress-bar stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
