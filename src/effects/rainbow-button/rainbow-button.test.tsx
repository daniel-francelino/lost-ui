import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./rainbow-button.stories";

const { Playground, Outline } = composeStories(stories);

describe("RainbowButton", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the outline story", () => {
    const { container } = render(<Outline />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<Playground onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

describe("rainbow-button stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
