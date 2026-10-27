import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./code-comparison.stories";

const { Default } = composeStories(stories);

describe("CodeComparison", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("labels both sides with the filename", () => {
    render(<Default />);
    expect(screen.getAllByText("total.ts").length).toBeGreaterThan(0);
  });

  it("shows the code before it is highlighted", () => {
    const { container } = render(<Default />);
    expect(container.textContent).toContain("items.reduce");
  });
});
