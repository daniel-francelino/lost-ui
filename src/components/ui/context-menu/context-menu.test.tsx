import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./context-menu.stories";

const { Default } = composeStories(stories);

describe("ContextMenu", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("opens on right click", async () => {
    render(<Default />);
    await userEvent.pointer({ keys: "[MouseRight]", target: screen.getByText("Right click here") });
    expect(screen.getByRole("menuitem", { name: "Reload" })).toBeInTheDocument();
  });
});
