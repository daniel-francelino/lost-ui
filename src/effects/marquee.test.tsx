import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./marquee.stories";

const { Default, Vertical } = composeStories(stories);

describe("Marquee", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the vertical story", () => {
    const { container } = render(<Vertical />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("repeats the children so the loop is seamless", () => {
    render(<Default />);
    expect(screen.getAllByText("Design").length).toBeGreaterThan(1);
  });

  it("switches to the vertical animation", () => {
    const { container } = render(<Vertical />);
    expect(container.querySelector(".animate-lost-marquee-vertical")).not.toBeNull();
  });
});
