import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-shiny-text.stories";

const { Playground } = composeStories(stories);

describe("AnimatedShinyText", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the text", () => {
    render(<Playground />);
    expect(screen.getByText("Introducing lost-ui")).toBeInTheDocument();
  });
});

describe("animated-shiny-text stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
