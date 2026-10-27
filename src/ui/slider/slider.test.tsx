import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./slider.stories";

const { Default } = composeStories(stories);

describe("Slider", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("exposes its value to assistive technology", () => {
    render(<Default />);
    expect(screen.getByRole("slider")).toHaveAttribute("aria-valuenow", "50");
  });
});
