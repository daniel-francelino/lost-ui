import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./avatar-circles.stories";

const { Playground } = composeStories(stories);

describe("AvatarCircles", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders one avatar per url", () => {
    render(<Playground />);
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });

  it("shows how many more people there are", () => {
    render(<Playground />);
    expect(screen.getByText("+99")).toBeInTheDocument();
  });
});

describe("avatar-circles stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
