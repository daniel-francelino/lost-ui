import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./video-text.stories";

const { Default } = composeStories(stories);

describe("VideoText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("uses the video as the text mask", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("video")).not.toBeNull();
  });
});
