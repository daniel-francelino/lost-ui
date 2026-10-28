import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./shiny-button.stories";

const { Playground } = composeStories(stories);

describe("ShinyButton", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows its label", () => {
    render(<Playground />);
    expect(screen.getByText("Shiny button")).toBeInTheDocument();
  });
});

describe("shiny-button stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
