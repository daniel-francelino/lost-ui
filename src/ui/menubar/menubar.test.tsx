import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./menubar.stories";

const { Default } = composeStories(stories);

describe("Menubar", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("opens a menu from its trigger", async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole("menuitem", { name: "File" }));
    expect(screen.getByRole("menuitem", { name: "New tab" })).toBeInTheDocument();
  });
});
