import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./toggle.stories";

const { Default, Outline } = composeStories(stories);

describe("Toggle", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the outline story", () => {
    const { container } = render(<Outline />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("flips its pressed state when clicked", async () => {
    render(<Default />);
    const toggle = screen.getByRole("button", { name: "Toggle italic" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
  });
});
