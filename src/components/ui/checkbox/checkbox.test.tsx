import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./checkbox.stories";

const { Default } = composeStories(stories);

describe("Checkbox", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("toggles when clicked", async () => {
    render(<Default />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
