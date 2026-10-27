import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./progressive-blur.stories";

const { Default } = composeStories(stories);

describe("ProgressiveBlur", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the stacked blur layers", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll("div").length).toBeGreaterThan(5);
  });
});
