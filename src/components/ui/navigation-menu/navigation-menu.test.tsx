import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./navigation-menu.stories";

const { Default } = composeStories(stories);

describe("NavigationMenu", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows its links when the trigger is opened", async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole("button", { name: "Getting started" }));
    expect(await screen.findByRole("link", { name: "Installation" })).toBeInTheDocument();
  });
});
