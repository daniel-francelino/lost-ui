import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./text-animate.stories";

const { Default, ByCharacter } = composeStories(stories);

describe("TextAnimate", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the by character story", () => {
    const { container } = render(<ByCharacter />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("splits the text by word", () => {
    const { container } = render(<Default />);
    expect(container.textContent).toContain("Animated text from lost-ui");
  });
});
