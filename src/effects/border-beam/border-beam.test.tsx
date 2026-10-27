import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./border-beam.stories";

const { Default } = composeStories(stories);

describe("BorderBeam", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws the beam over the card", () => {
    const { container } = render(<Default />);
    expect(container.querySelectorAll("div").length).toBeGreaterThan(1);
  });
});
