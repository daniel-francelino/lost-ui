import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./popover.stories";

const { Default } = composeStories(stories);

describe("Popover", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows its content when opened", async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole("button", { name: "Open popover" }));
    expect(screen.getByText(/Place content/)).toBeInTheDocument();
  });
});
