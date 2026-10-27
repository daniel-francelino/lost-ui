import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./marquee.stories";

const { Playground, Vertical } = composeStories(stories);

describe("Marquee", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the vertical story", () => {
    const { container } = render(<Vertical />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("repeats the children so the loop is seamless", () => {
    render(<Playground />);
    expect(screen.getAllByText("Design").length).toBeGreaterThan(1);
  });

  it("switches to the vertical animation", () => {
    const { container } = render(<Vertical />);
    expect(container.querySelector(".animate-lost-marquee-vertical")).not.toBeNull();
  });
});

describe("marquee stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
