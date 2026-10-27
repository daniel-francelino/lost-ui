import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./comic-text.stories";

const { Default } = composeStories(stories);

describe("ComicText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps the text accessible", () => {
    const { container } = render(<Default />);
    expect(container.textContent).toContain("BOOM!");
  });
});
