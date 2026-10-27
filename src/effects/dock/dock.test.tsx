import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./dock.stories";

const { Default } = composeStories(stories);

describe("Dock", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders one slot per icon", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll("svg")).toHaveLength(3);
  });
});
