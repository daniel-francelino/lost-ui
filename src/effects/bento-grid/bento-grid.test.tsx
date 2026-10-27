import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./bento-grid.stories";

const { Default } = composeStories(stories);

describe("BentoGrid", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders every card with its call to action", () => {
    render(<Default />);
    expect(screen.getByText("Save your files")).toBeInTheDocument();
    expect(screen.getAllByText("Learn more").length).toBeGreaterThanOrEqual(3);
  });
});
