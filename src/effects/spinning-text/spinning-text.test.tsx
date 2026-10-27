import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./spinning-text.stories";

const { Default } = composeStories(stories);

describe("SpinningText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders each letter", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll("span").length).toBeGreaterThan(10);
  });
});
