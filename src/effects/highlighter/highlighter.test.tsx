import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./highlighter.stories";

const { Default, Underline } = composeStories(stories);

describe("Highlighter", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the underline story", () => {
    const { container } = render(<Underline />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps the text in the flow", () => {
    render(<Default />);
    expect(screen.getByText("highlighted")).toBeInTheDocument();
  });
});
