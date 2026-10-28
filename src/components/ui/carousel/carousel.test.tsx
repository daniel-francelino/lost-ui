import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./carousel.stories";

const { Default } = composeStories(stories);

describe("Carousel", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders every slide and the controls", () => {
    render(<Default />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous slide" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next slide" })).toBeInTheDocument();
  });
});
