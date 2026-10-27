import { composeStories } from "@storybook/react-vite";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./rainbow-button.stories";

const { Default, Outline } = composeStories(stories);

describe("RainbowButton", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the outline story", () => {
    const { container } = render(<Outline />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<Default onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
