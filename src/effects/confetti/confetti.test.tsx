import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import confetti from "canvas-confetti";
import * as stories from "./confetti.stories";

vi.mock("canvas-confetti", () => ({
  default: Object.assign(vi.fn(), { create: vi.fn(() => vi.fn()) }),
}));

const { Default } = composeStories(stories);

describe("Confetti", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("fires confetti on click", () => {
    render(<Default />);
    fireEvent.click(screen.getByRole("button", { name: "Celebrate" }));
    expect(confetti).toHaveBeenCalled();
  });
});
