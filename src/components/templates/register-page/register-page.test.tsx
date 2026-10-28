import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./register-page.stories";

const { Playground, EmailOnly, ServerError, ShorterPassword } = composeStories(stories);

type User = ReturnType<typeof userEvent.setup>;

async function fillAll(user: User, password = "a-long-password") {
  await user.type(screen.getByLabelText(/^Name/), "Ada Lovelace");
  await user.type(screen.getByLabelText(/^Username/), "ada");
  await user.type(screen.getByLabelText(/^Email/), "ada@acme.com");
  await user.type(screen.getByLabelText(/^Password/), password);
  await user.type(screen.getByLabelText(/^Repeat the password/), password);
}

describe("RegisterPage", () => {
  it("asks for the name, the username, the email and the password twice", () => {
    render(<Playground />);
    for (const label of [/^Name/, /^Username/, /^Email/, /^Password/, /^Repeat the password/]) {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    }
    expect(screen.getByText("At least 10 characters.")).toBeInTheDocument();
  });

  it("links back to sign in", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/login");
  });

  it("submits the account without the confirmation", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await fillAll(user);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Ada Lovelace",
        username: "ada",
        email: "ada@acme.com",
        password: "a-long-password",
      }),
    );
  });

  it("does not submit when the passwords differ", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await fillAll(user);
    await user.type(screen.getByLabelText(/^Repeat the password/), "x");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("The passwords do not match.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit a short password", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await fillAll(user, "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findAllByText(/use at least 10 characters/i)).not.toHaveLength(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("takes the length of the password from minPasswordLength", () => {
    render(<ShorterPassword />);
    expect(screen.getByText("At least 8 characters.")).toBeInTheDocument();
  });

  it("asks only for the fields it is given", () => {
    render(<EmailOnly />);
    expect(screen.queryByLabelText(/^Name/)).toBeNull();
    expect(screen.queryByLabelText(/^Username/)).toBeNull();
    expect(screen.getByLabelText(/^Email/)).toBeInTheDocument();
  });

  it("shows the error the handler returns", async () => {
    const user = userEvent.setup();
    render(<ServerError />);

    await fillAll(user);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("That username is taken.");
  });
});
