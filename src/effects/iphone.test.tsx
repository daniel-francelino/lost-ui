import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./iphone.stories";

const { Default } = composeStories(stories);

describe("Iphone", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws the device frame with the screenshot", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("svg")).not.toBeNull();
  });
});
