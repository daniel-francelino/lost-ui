import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./kinetic-text.stories";

const { Default } = composeStories(stories);

describe("KineticText", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders a heading by default", () => {
    render(<Default />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
});
