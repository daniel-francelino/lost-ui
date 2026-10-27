import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./dot-pattern.stories";

const { Default } = composeStories(stories);

describe("DotPattern", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws the pattern", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
