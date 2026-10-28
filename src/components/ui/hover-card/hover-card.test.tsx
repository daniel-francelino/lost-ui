import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./hover-card.stories";

const { Default } = composeStories(stories);

describe("HoverCard", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the card on hover", async () => {
    render(<Default />);
    await userEvent.hover(screen.getByRole("button", { name: "@lostui" }));
    expect(await screen.findByText(/component library/)).toBeInTheDocument();
  });
});
