import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import userEvent from "@testing-library/user-event";
import * as stories from "./input.stories";

const { Default, Disabled } = composeStories(stories);

describe("Input", () => {
  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("renders the disabled story", () => {
    const { container } = render(<Disabled />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("keeps what the user types", async () => {
    render(<Default />);
    const input = screen.getByPlaceholderText("Email");
    await userEvent.type(input, "me@lost.ui");
    expect(input).toHaveValue("me@lost.ui");
  });

  it("does not accept input when disabled", () => {
    render(<Disabled />);
    expect(screen.getByPlaceholderText("Disabled")).toBeDisabled();
  });
});
