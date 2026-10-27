import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./sonner.stories";

const { Default } = composeStories(stories);

describe("Sonner", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows a toast when triggered", async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(await screen.findByText("Event has been created")).toBeInTheDocument();
  });
});
