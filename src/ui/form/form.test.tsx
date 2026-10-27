import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./form.stories";

const { Default } = composeStories(stories);

describe("Form", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("links the label and the description to the input", () => {
    render(<Default />);
    const input = screen.getByLabelText("Username");
    expect(input).toHaveAccessibleDescription("This is your public display name.");
  });

  it("keeps what the user types", async () => {
    render(<Default />);
    const input = screen.getByLabelText("Username");
    await userEvent.type(input, "lostui");
    expect(input).toHaveValue("lostui");
  });
});
