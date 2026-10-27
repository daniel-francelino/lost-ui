import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./icon-cloud.stories";

const { Default } = composeStories(stories);

describe("IconCloud", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("draws the cloud on a canvas", () => {
    const { container } = render(<Default />);
    expect(container.querySelector("canvas")).not.toBeNull();
  });
});
