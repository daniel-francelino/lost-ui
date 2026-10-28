import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./login-page.stories";

const { Playground, EmailOnly, ServerError, Split, WithOtherWays } = composeStories(stories);

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Email or username/), "ada");
  await user.type(screen.getByLabelText(/^Password/), "secret");
}

describe("LoginPage", () => {
  it("shows the title, the fields and the links", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email or username/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Forgot my password" })).toHaveAttribute(
      "href",
      "/recover-password",
    );
    expect(screen.getByRole("link", { name: "Request access" })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("does not submit empty fields and says what is missing", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits what was typed", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await fill(user);
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({ identifier: "ada", password: "secret" }),
    );
  });

  it("shows the error the handler returns", async () => {
    const user = userEvent.setup();
    render(<ServerError />);

    await fill(user);
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Wrong email or password.");
  });

  it("shows a generic error when the handler throws", async () => {
    const user = userEvent.setup();
    render(
      <Playground
        onSubmit={vi.fn(() => {
          throw new Error("boom");
        })}
      />,
    );

    await fill(user);
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong");
  });

  it("is disabled while it signs in", async () => {
    const user = userEvent.setup();
    let finish: () => void = () => {};
    render(
      <Playground onSubmit={vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))} />,
    );

    await fill(user);
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await vi.waitFor(() => expect(screen.getByRole("button", { name: "Sign in" })).toBeDisabled());
    finish();
    await vi.waitFor(() => expect(screen.getByRole("button", { name: "Sign in" })).toBeEnabled());
  });

  it("asks for an email when it is the only way in", () => {
    render(<EmailOnly />);
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("type", "email");
  });

  it("can have a panel at the side and other ways in", () => {
    const { unmount } = render(<Split />);
    expect(screen.getByText("Welcome back.")).toBeInTheDocument();
    unmount();
    render(<WithOtherWays />);
    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument();
  });

  it("leaves out the links it has no address for", () => {
    render(<Playground forgotPasswordHref={undefined} registerHref={undefined} />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});
