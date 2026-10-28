import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./scroll-area.stories";

const { Default } = composeStories(stories);

describe("ScrollArea", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders its content inside the viewport", () => {
    render(<Default />);
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });
});
