import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./morphing-text.stories";

const { Default } = composeStories(stories);

describe("MorphingText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders both morphing layers", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll("span").length).toBeGreaterThanOrEqual(2);
  });
});
