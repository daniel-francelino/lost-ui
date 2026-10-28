import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Text3DFlip } from "./text-3d-flip";
import * as stories from "./text-3d-flip.stories";

const { Playground } = composeStories(stories);

describe("Text3DFlip", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("is available as a named export", () => {
    expect(Text3DFlip).toBeTypeOf("function");
  });
});

describe("text-3d-flip stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
