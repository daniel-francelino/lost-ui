import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./magic-card.stories";

const { Default, Orb } = composeStories(stories);

describe("MagicCard", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the orb story", () => {
    const { container } = render(<Orb />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders its children", () => {
    render(<Default />);
    expect(screen.getByText("Magic card")).toBeInTheDocument();
  });
});
