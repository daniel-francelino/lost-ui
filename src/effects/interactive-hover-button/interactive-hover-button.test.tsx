import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./interactive-hover-button.stories";

const { Default } = composeStories(stories);

describe("InteractiveHoverButton", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows its label", () => {
    render(<Default />);
    expect(screen.getAllByText("Hover me").length).toBeGreaterThan(0);
  });
});
