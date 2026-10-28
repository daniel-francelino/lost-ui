import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./highlighter.stories";

const { Playground, Underline } = composeStories(stories);

describe("Highlighter", () => {
  it("renders the playground story", () => {
    const { container } = render(<Playground />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the underline story", () => {
    const { container } = render(<Underline />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps the text in the flow", () => {
    render(<Playground />);
    expect(screen.getByText("highlighted")).toBeInTheDocument();
  });
});

describe("highlighter stories render", () => {
  it.each(Object.entries(composeStories(stories)))("renders %s", (_name, Story) => {
    const { container } = render(<Story />);
    expect(container.firstElementChild).not.toBeNull();
  });
});
