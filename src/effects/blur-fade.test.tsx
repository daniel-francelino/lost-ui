import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./blur-fade.stories";

const { Default } = composeStories(stories);

describe("BlurFade", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders its children", () => {
    render(<Default />);
    expect(screen.getByText("Blur fade")).toBeInTheDocument();
  });
});
