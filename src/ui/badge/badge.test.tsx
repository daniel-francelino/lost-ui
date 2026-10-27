import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./badge.stories";

const { Default, Secondary, Destructive, Outline } = composeStories(stories);

describe("Badge", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the secondary story", () => {
    const { container } = render(<Secondary />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the destructive story", () => {
    const { container } = render(<Destructive />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the outline story", () => {
    const { container } = render(<Outline />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows its label", () => {
    render(<Default />);
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("applies the variant styles", () => {
    render(<Destructive />);
    expect(screen.getByText("Destructive")).toHaveClass("bg-destructive");
  });
});
