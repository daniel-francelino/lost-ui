import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./particles.stories";

const { Default } = composeStories(stories);

describe("Particles", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws on a canvas", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
