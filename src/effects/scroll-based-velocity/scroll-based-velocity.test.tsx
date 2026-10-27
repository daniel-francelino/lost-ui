import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./scroll-based-velocity.stories";

const { Default } = composeStories(stories);

describe("ScrollVelocity", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders both rows", () => {
    const { container } = render(<Default />);
    expect(container.textContent).toContain("Scroll velocity");
    expect(container.textContent).toContain("Another row");
  });
});
