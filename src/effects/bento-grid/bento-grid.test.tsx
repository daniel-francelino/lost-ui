import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./bento-grid.stories";

const { Playground } = composeStories(stories);

describe("BentoGrid", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders every card with its call to action", () => {
    render(<Playground />);
    expect(screen.getByText("Save your files")).toBeInTheDocument();
    expect(screen.getAllByText("Learn more").length).toBeGreaterThanOrEqual(3);
  });
});

describe("bento-grid stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
