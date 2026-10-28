import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./meteors.stories";

const { Playground } = composeStories(stories);

describe("Meteors", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the requested number of meteors", () => {
    const { container } = render(<Playground />);
    expect(container.querySelectorAll(".animate-lost-meteor")).toHaveLength(20);
  });
});

describe("meteors stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
