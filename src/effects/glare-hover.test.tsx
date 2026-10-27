import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./glare-hover.stories";

const { Default } = composeStories(stories);

describe("GlareHover", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders its children", () => {
    render(<Default />);
    expect(screen.getByText("Hover for a glare")).toBeInTheDocument();
  });
});
