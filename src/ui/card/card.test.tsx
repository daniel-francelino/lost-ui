import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./card.stories";

const { Default } = composeStories(stories);

describe("Card", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders every section", () => {
    render(<Default />);
    expect(screen.getByText("Create project")).toBeInTheDocument();
    expect(screen.getByText("Card content")).toBeInTheDocument();
    expect(screen.getByText("Card footer")).toBeInTheDocument();
  });
});
