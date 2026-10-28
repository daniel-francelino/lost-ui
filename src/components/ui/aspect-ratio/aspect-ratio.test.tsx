import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./aspect-ratio.stories";

const { Default } = composeStories(stories);

describe("AspectRatio", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the content inside the ratio box", () => {
    render(<Default />);
    expect(screen.getByAltText("Sample")).toBeInTheDocument();
  });
});
