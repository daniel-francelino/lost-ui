import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./pointer.stories";

const { Default } = composeStories(stories);

describe("Pointer", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders next to the hover target", () => {
    render(<Default />);
    expect(screen.getByText("Hover here")).toBeInTheDocument();
  });
});
