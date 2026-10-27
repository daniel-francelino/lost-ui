import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./smooth-cursor.stories";

const { Playground } = composeStories(stories);

describe("SmoothCursor", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders without blocking the page", () => {
    render(<Playground />);
    expect(screen.getByText(/Move the mouse/)).toBeInTheDocument();
  });
});

describe("smooth-cursor stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
