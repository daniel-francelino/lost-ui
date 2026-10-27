import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./ripple.stories";

const { Default } = composeStories(stories);

describe("Ripple", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders concentric circles", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll(".animate-lost-ripple").length).toBeGreaterThan(1);
  });
});
