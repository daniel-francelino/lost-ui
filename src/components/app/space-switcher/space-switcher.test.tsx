import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import * as stories from "./space-switcher.stories";

const { Playground, OneSpace } = composeStories(stories);

describe("SpaceSwitcher", () => {
  it("renders a button to switch space", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: "Switch space" })).toBeInTheDocument();
  });

  it("opens a grid of the spaces and marks the current one", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    await user.click(screen.getByRole("button", { name: "Switch space" }));
    expect(await screen.findByText("Spaces")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Marketing" })).toHaveAttribute("href", "/marketing");
    expect(screen.getByRole("link", { name: "Marketing" })).not.toHaveAttribute("aria-current");
  });

  it("closes after a space is chosen", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    await user.click(screen.getByRole("button", { name: "Switch space" }));
    await user.click(await screen.findByRole("link", { name: "Marketing" }));
    expect(screen.queryByText("Spaces")).toBeNull();
  });

  it("renders nothing for a single space", () => {
    const { container } = render(<OneSpace />);
    expect(container).toBeEmptyDOMElement();
  });

  it("can name the button", () => {
    render(<Playground label="Areas" />);
    expect(screen.getByRole("button", { name: "Areas" })).toBeInTheDocument();
  });
});
