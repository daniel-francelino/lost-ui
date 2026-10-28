import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./breadcrumb.stories";

const { Default } = composeStories(stories);

describe("Breadcrumb", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("marks the current page", () => {
    render(<Default />);
    expect(screen.getByRole("navigation", { name: "breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Breadcrumb")).toHaveAttribute("aria-current", "page");
  });
});
