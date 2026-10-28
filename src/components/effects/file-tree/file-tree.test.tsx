import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./file-tree.stories";

const { Playground } = composeStories(stories);

describe("FileTree", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the expanded folder", () => {
    render(<Playground />);
    expect(screen.getByText("src")).toBeInTheDocument();
    expect(screen.getByText("index.ts")).toBeInTheDocument();
  });
});

describe("file-tree stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
