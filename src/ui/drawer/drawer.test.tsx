import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./drawer.stories";

const { Default } = composeStories(stories);

describe("Drawer", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("opens from its trigger", async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole("button", { name: "Open drawer" }));
    expect(await screen.findByText("Move goal")).toBeInTheDocument();
  });
});
