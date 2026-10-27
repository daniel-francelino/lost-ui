import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./separator.stories";

const { Default, Vertical } = composeStories(stories);

describe("Separator", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the vertical story", () => {
    const { container } = render(<Vertical />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("is horizontal by default", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).toHaveAttribute("data-orientation", "horizontal");
  });

  it("supports the vertical orientation", () => {
    const { container } = render(<Vertical />);
    expect(container.firstElementChild).toHaveAttribute("data-orientation", "vertical");
  });
});
