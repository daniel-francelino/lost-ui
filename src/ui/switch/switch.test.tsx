import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./switch.stories";

const { Default } = composeStories(stories);

describe("Switch", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("toggles when clicked", async () => {
    render(<Default />);
    const toggle = screen.getByRole("switch", { name: "Airplane mode" });
    expect(toggle).not.toBeChecked();
    await userEvent.click(toggle);
    expect(toggle).toBeChecked();
  });
});
