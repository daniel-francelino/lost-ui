import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./pixel-image.stories";

const { Default } = composeStories(stories);

describe("PixelImage", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the pixel grid", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll("div").length).toBeGreaterThan(10);
  });
});
