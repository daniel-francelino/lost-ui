import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./striped-pattern.stories";

const { Default } = composeStories(stories);

describe("StripedPattern", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("defines a repeating pattern", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("svg pattern")).not.toBeNull();
  });
});
