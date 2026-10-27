import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./shiny-button.stories";

const { Default } = composeStories(stories);

describe("ShinyButton", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows its label", () => {
    render(<Default />);
    expect(screen.getByText("Shiny button")).toBeInTheDocument();
  });
});
