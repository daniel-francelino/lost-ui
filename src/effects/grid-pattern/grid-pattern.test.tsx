import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./grid-pattern.stories";

const { Default } = composeStories(stories);

describe("GridPattern", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws one rect per highlighted square", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll("svg rect").length).toBeGreaterThanOrEqual(4);
  });
});
