import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import * as stories from "./form-input-password.stories";

const { Playground, WithRules, NewPassword } = composeStories(stories);

describe("FormInputPassword", () => {
  it("hides what is typed", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    const input = screen.getByLabelText("Password");
    await user.type(input, "secret");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveValue("secret");
  });

  it("shows and hides the text with the button", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    const button = screen.getByRole("button", { name: "Show password" });
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);

    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("suggests the stored password for sign in, a new one for sign up", () => {
    const { unmount } = render(<Playground />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("autocomplete", "current-password");
    unmount();
    render(<NewPassword />);
    expect(screen.getByLabelText("New password")).toHaveAttribute("autocomplete", "new-password");
  });

  it("validates with rules", async () => {
    const user = userEvent.setup();
    render(<WithRules />);
    const input = screen.getByLabelText(/Password/);
    await user.type(input, "short");
    await user.tab();
    expect(await screen.findByText(/use at least 10 characters/i)).toBeInTheDocument();
  });
});
