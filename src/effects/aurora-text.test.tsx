import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./aurora-text.stories";

const { Default, Faster } = composeStories(stories);

describe("AuroraText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the faster story", () => {
    const { container } = render(<Faster />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the highlighted text", () => {
    render(<Default />);
    expect(screen.getAllByText("Aurora").length).toBeGreaterThan(0);
  });
});
