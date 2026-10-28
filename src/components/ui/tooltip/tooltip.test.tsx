import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./tooltip.stories";

const { Default } = composeStories(stories);

describe("Tooltip", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows its content on hover", async () => {
    render(<Default />);
    await userEvent.hover(screen.getByRole("button", { name: "Hover me" }));
    expect((await screen.findAllByText("Add to library")).length).toBeGreaterThan(0);
  });
});
