import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./aurora-text.stories";

const { Playground, Faster } = composeStories(stories);

describe("AuroraText", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the faster story", () => {
    const { container } = render(<Faster />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the highlighted text", () => {
    render(<Playground />);
    expect(screen.getAllByText("Aurora").length).toBeGreaterThan(0);
  });
});

describe("aurora-text stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
