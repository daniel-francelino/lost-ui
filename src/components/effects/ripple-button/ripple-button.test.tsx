import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./ripple-button.stories";

const { Playground } = composeStories(stories);

describe("RippleButton", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("adds a ripple element on click", () => {
    const { container } = render(<Playground />);
    fireEvent.click(screen.getByRole("button"));
    expect(container.querySelectorAll("span").length).toBeGreaterThan(1);
  });
});

describe("ripple-button stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
