import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./dotted-map.stories";

const { Default } = composeStories(stories);

describe("DottedMap", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws the map as an svg", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
