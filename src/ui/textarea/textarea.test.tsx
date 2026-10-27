import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./textarea.stories";

const { Default } = composeStories(stories);

describe("Textarea", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps what the user types", async () => {
    render(<Default />);
    const field = screen.getByPlaceholderText("Type your message here.");
    await userEvent.type(field, "hello");
    expect(field).toHaveValue("hello");
  });
});
