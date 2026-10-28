import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./neon-gradient-card.stories";

const { Playground } = composeStories(stories);

describe("NeonGradientCard", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders its children", () => {
    render(<Playground />);
    expect(screen.getByText("Neon card")).toBeInTheDocument();
  });
});

describe("neon-gradient-card stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
