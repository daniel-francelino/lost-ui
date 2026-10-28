import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import confetti from "canvas-confetti";
import * as stories from "./confetti.stories";

vi.mock("canvas-confetti", () => ({
  default: Object.assign(vi.fn(), {
    create: vi.fn(() => Object.assign(vi.fn(), { reset: vi.fn() })),
  }),
}));

const { Playground } = composeStories(stories);

describe("Confetti", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("fires confetti on click", () => {
    render(<Playground />);
    fireEvent.click(screen.getByRole("button", { name: "Celebrate" }));
    expect(confetti).toHaveBeenCalled();
  });
});

describe("confetti stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
