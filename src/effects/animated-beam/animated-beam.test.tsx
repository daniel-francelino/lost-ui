import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-beam.stories";

const { Default } = composeStories(stories);

describe("AnimatedBeam", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("connects the two nodes with an svg", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
