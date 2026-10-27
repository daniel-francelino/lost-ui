import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-beam.stories";

const { Playground } = composeStories(stories);

describe("AnimatedBeam", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("connects the two nodes with an svg", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});

describe("animated-beam stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
