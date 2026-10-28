import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./skeleton.stories";

const { Default } = composeStories(stories);

describe("Skeleton", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("pulses while content loads", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).toHaveClass("animate-pulse");
  });
});
