import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-theme-toggler.stories";

const { Playground } = composeStories(stories);

describe("AnimatedThemeToggler", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders an accessible button", () => {
    render(<Playground />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});

describe("animated-theme-toggler stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
