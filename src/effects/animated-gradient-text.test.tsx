import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-gradient-text.stories";

const { Default } = composeStories(stories);

describe("AnimatedGradientText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the text", () => {
    render(<Default />);
    expect(screen.getByText("Introducing lost-ui")).toBeInTheDocument();
  });
});
