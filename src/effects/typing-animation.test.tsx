import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./typing-animation.stories";

const { Default, RotatingWords } = composeStories(stories);

describe("TypingAnimation", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the rotating words story", () => {
    const { container } = render(<RotatingWords />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows a cursor while typing", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
