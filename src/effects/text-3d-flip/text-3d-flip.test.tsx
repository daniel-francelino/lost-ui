import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Text3DFlip } from "./text-3d-flip";
import * as stories from "./text-3d-flip.stories";

const { Default } = composeStories(stories);

describe("Text3DFlip", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("is available as a named export", () => {
    expect(Text3DFlip).toBeTypeOf("function");
  });
});
