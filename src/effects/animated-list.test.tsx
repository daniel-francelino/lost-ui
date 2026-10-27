import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./animated-list.stories";

const { Default } = composeStories(stories);

describe("AnimatedList", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the first notification first", () => {
    render(<Default />);
    expect(screen.getByText("Payment received")).toBeInTheDocument();
  });
});
