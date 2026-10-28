import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./slider.stories";

const { Default, Range } = composeStories(stories);

describe("Slider", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("exposes its value to assistive technology", () => {
    render(<Default />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders one thumb for a single value", () => {
    render(<Default />);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
  });

  it("renders one thumb per value for a range", () => {
    render(<Range />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "20");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "80");
  });
});
