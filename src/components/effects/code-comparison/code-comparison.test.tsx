import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./code-comparison.stories";

const { Playground } = composeStories(stories);

describe("CodeComparison", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("labels both sides with the filename", () => {
    render(<Playground />);
    expect(screen.getAllByText("total.ts").length).toBeGreaterThan(0);
  });

  it("shows the code before it is highlighted", () => {
    const { container } = render(<Playground />);
    expect(container.textContent).toContain("items.reduce");
  });
});

describe("code-comparison stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
