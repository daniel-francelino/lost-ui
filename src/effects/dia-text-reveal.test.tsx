import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./dia-text-reveal.stories";

const { Default } = composeStories(stories);

describe("DiaTextReveal", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the text", () => {
    const { container } = render(<Default />);
    expect(container.textContent).toContain("Lost UI");
  });
});
