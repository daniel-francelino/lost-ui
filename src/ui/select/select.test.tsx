import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./select.stories";

const { Default } = composeStories(stories);

describe("Select", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows the placeholder", () => {
    render(<Default />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Select a fruit");
  });

  it("chooses an option", async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole("combobox"));
    await userEvent.click(await screen.findByRole("option", { name: "Banana" }));
    expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
  });
});
