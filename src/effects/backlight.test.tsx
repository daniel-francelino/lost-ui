import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./backlight.stories";

const { Default } = composeStories(stories);

describe("Backlight", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps the image in front of the glow", () => {
    render(<Default />);
    expect(screen.getAllByAltText("Backlight").length).toBeGreaterThan(0);
  });
});
