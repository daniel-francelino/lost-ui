import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./text-reveal.stories";

const { Playground } = composeStories(stories);

describe("TextReveal", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps the full sentence", () => {
    render(<Playground />);
    expect(screen.getAllByText("reveal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("themselves").length).toBeGreaterThan(0);
  });
});

describe("text-reveal stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
