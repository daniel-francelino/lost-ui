import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./magic-card.stories";

const { Playground, Orb } = composeStories(stories);

describe("MagicCard", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the orb story", () => {
    const { container } = render(<Orb />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders its children", () => {
    render(<Playground />);
    expect(screen.getByText("Magic card")).toBeInTheDocument();
  });
});

describe("magic-card stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
