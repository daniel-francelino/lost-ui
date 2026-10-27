import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-circular-progress-bar.stories";

const { Default } = composeStories(stories);

describe("AnimatedCircularProgressBar", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the current value", () => {
    render(<Default />);
    expect(screen.getByText("65")).toBeInTheDocument();
  });
});
