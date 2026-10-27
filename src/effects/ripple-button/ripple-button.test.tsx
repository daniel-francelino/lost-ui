import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./ripple-button.stories";

const { Default } = composeStories(stories);

describe("RippleButton", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("adds a ripple element on click", () => {
    const { container } = render(<Default />);
    fireEvent.click(screen.getByRole("button"));
    expect(container.querySelectorAll("span").length).toBeGreaterThan(1);
  });
});
