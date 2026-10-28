import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./avatar.stories";

const { Default } = composeStories(stories);

describe("Avatar", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the fallback while the image is unavailable", () => {
    render(<Default />);
    expect(screen.getByText("LU")).toBeInTheDocument();
  });
});
