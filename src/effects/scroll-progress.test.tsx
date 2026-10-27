import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./scroll-progress.stories";

const { Default } = composeStories(stories);

describe("ScrollProgress", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the progress bar", () => {
    const { container } = render(<Default />);
    expect(container.querySelector(".fixed")).not.toBeNull();
  });
});
