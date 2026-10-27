import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./light-rays.stories";

const { Default } = composeStories(stories);

describe("LightRays", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws the pattern", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("div")).not.toBeNull();
  });
});
