import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./word-rotate.stories";

const { Default } = composeStories(stories);

describe("WordRotate", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("starts with the first word", () => {
    render(<Default />);
    expect(screen.getByText("Design")).toBeInTheDocument();
  });
});
