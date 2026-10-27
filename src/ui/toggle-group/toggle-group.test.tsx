import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./toggle-group.stories";

const { Default } = composeStories(stories);

describe("ToggleGroup", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps one option selected at a time", async () => {
    render(<Default />);
    expect(screen.getByLabelText("Bold")).toHaveAttribute("data-state", "on");
    await userEvent.click(screen.getByLabelText("Italic"));
    expect(screen.getByLabelText("Italic")).toHaveAttribute("data-state", "on");
    expect(screen.getByLabelText("Bold")).toHaveAttribute("data-state", "off");
  });
});
