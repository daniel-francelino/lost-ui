import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./avatar-circles.stories";

const { Default } = composeStories(stories);

describe("AvatarCircles", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders one avatar per url", () => {
    render(<Default />);
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });

  it("shows how many more people there are", () => {
    render(<Default />);
    expect(screen.getByText("+99")).toBeInTheDocument();
  });
});
