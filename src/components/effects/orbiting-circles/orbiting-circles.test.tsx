import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./orbiting-circles.stories";

const { Playground } = composeStories(stories);

describe("OrbitingCircles", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders every orbiting child", () => {
    render(<Playground />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
  });
});

describe("orbiting-circles stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
