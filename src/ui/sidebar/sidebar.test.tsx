import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./sidebar.stories";

const { Default } = composeStories(stories);

describe("Sidebar", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the menu and the main content", () => {
    render(<Default />);
    expect(screen.getByText("Application")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inbox" })).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });
});
