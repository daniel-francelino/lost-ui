import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./cool-mode.stories";

const { Default } = composeStories(stories);

describe("CoolMode", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("wraps the child without changing it", () => {
    render(<Default />);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });
});
