import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./collapsible.stories";

const { Default } = composeStories(stories);

describe("Collapsible", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("reveals its content when toggled", async () => {
    render(<Default />);
    expect(screen.queryByText("Hidden details")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Toggle details" }));
    expect(screen.getByText("Hidden details")).toBeVisible();
  });
});
