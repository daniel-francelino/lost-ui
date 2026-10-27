import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./smooth-cursor.stories";

const { Default } = composeStories(stories);

describe("SmoothCursor", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders without blocking the page", () => {
    render(<Default />);
    expect(screen.getByText(/Move the mouse/)).toBeInTheDocument();
  });
});
