import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./line-shadow-text.stories";

const { Default } = composeStories(stories);

describe("LineShadowText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the text", () => {
    const { container } = render(<Default />);
    expect(container.textContent).toContain("Shadow");
  });
});
