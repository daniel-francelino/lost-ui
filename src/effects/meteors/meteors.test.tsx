import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./meteors.stories";

const { Default } = composeStories(stories);

describe("Meteors", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the requested number of meteors", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll(".animate-lost-meteor")).toHaveLength(20);
  });
});
