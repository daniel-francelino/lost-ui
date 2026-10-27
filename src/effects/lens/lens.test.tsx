import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./lens.stories";

const { Default } = composeStories(stories);

describe("Lens", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps the image visible", () => {
    render(<Default />);
    expect(screen.getByAltText("Lens target")).toBeInTheDocument();
  });
});
