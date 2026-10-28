import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./cool-mode.stories";

const { Playground } = composeStories(stories);

describe("CoolMode", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("wraps the child without changing it", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });
});

describe("cool-mode stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
