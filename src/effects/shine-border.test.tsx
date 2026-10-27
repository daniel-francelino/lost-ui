import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./shine-border.stories";

const { Default } = composeStories(stories);

describe("ShineBorder", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("joins the colours into one gradient", () => {
    const { container } = render(<Default />);
    expect(container.innerHTML).toContain("var(--effect-from)");
  });
});
