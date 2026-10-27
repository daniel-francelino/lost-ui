import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-theme-toggler.stories";

const { Default } = composeStories(stories);

describe("AnimatedThemeToggler", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders an accessible button", () => {
    render(<Default />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
