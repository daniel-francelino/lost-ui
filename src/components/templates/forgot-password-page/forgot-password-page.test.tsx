import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./forgot-password-page.stories";

const { Playground, ServerError } = composeStories(stories);

describe("ForgotPasswordPage", () => {
  it("asks for the email and links back to sign in", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { name: "Recover your password" })).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to sign in" })).toHaveAttribute("href", "/login");
  });

  it("does not send an invalid email", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^Email/), "not-an-email");
    await user.click(screen.getByRole("button", { name: "Send the link" }));

    expect(await screen.findByText("Enter a valid email")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sends the email and then tells the user to check the inbox", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^Email/), "ada@acme.com");
    await user.click(screen.getByRole("button", { name: "Send the link" }));

    expect(await screen.findByRole("heading", { name: "Check your email" })).toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalledWith({ email: "ada@acme.com" });
    expect(screen.queryByLabelText(/^Email/)).toBeNull();
  });

  it("stays on the form and shows the error when it fails", async () => {
    const user = userEvent.setup();
    render(<ServerError />);

    await user.type(screen.getByLabelText(/^Email/), "ada@acme.com");
    await user.click(screen.getByRole("button", { name: "Send the link" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Too many tries");
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
  });
});
