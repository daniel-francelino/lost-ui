import { composeStories } from "@storybook/react-vite";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./safari.stories";

const { Default } = composeStories(stories);

describe("Safari", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the address in the toolbar", () => {
    const { container } = render(<Default />);
    expect(container.textContent).toContain("lost-ui.dev");
  });
});
