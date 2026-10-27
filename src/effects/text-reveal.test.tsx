import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./text-reveal.stories";

const { Default } = composeStories(stories);

describe("TextReveal", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps the full sentence", () => {
    render(<Default />);
    expect(screen.getAllByText("reveal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("themselves").length).toBeGreaterThan(0);
  });
});
