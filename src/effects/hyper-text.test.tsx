import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./hyper-text.stories";

const { Default } = composeStories(stories);

describe("HyperText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders one element per character", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll("span").length).toBeGreaterThanOrEqual(9);
  });
});
