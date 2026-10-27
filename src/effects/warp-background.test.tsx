import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./warp-background.stories";

const { Default } = composeStories(stories);

describe("WarpBackground", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders its children", () => {
    render(<Default />);
    expect(screen.getByText("Warp background")).toBeInTheDocument();
  });
});
