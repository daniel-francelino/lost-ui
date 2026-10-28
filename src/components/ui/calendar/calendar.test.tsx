import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./calendar.stories";

const { Default } = composeStories(stories);

describe("Calendar", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the requested month", () => {
    render(<Default />);
    expect(screen.getByText(/January 2026/)).toBeInTheDocument();
  });

  it("renders the day grid", () => {
    render(<Default />);
    expect(screen.getByRole("grid")).toBeInTheDocument();
  });
});
