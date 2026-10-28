import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../i18n";
import { RegisterPage } from "./register-page";
import * as stories from "./register-page.stories";

const { Playground, AllFields, WithoutImage, WithoutProviders, ServerError, SingleCard } =
  composeStories(stories);

type User = ReturnType<typeof userEvent.setup>;

async function fillEmail(user: User, password = "a-long-password") {
  await user.type(screen.getByLabelText(/^Email/), "ada@acme.com");
  await user.type(screen.getByLabelText(/^Password/), password);
  await user.type(screen.getByLabelText(/^Repeat the password/), password);
}

describe("RegisterPage", () => {
  it("is the card of the sign in page, with the image at the side", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-variant='split-card']")).not.toBeNull();
    expect(screen.getByRole("complementary", { hidden: true })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Create your account" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Enter your email below to create your account")).toBeInTheDocument();
  });

  it("asks for the email, with its help text, and the password twice", () => {
    render(<Playground />);
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("placeholder", "m@example.com");
    expect(screen.getByText(/We'll use this to contact you/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Repeat the password/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/^Name/)).toBeNull();
  });

  it("puts the two password fields side by side with one line of help under them", () => {
    render(<Playground />);
    const pair = screen.getByLabelText(/^Password/).closest(".grid-cols-2");
    expect(pair).not.toBeNull();
    expect(pair).toContainElement(screen.getByLabelText(/^Repeat the password/));
    expect(screen.getByText("At least 8 characters.")).toBeInTheDocument();
  });

  it("does not mark the fields as required with an asterisk", () => {
    render(<Playground />);
    expect(screen.queryByText("*")).toBeNull();
  });

  it("shows the other ways to sign up", () => {
    render(<Playground />);
    expect(screen.getByText("Or continue with")).toBeInTheDocument();
    for (const name of ["Apple", "Google", "Meta"]) {
      expect(screen.getByRole("button", { name: `Continue with ${name}` })).toBeInTheDocument();
    }
  });

  it("calls the provider when its button is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <RegisterPage
        onSubmit={vi.fn()}
        providers={[{ id: "google", label: "Google", icon: <i />, onClick }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Continue with Google" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("leaves out the providers and the separator when there are none", () => {
    render(<WithoutProviders />);
    expect(screen.queryByText("Or continue with")).toBeNull();
  });

  it("puts the sign in line in the card and the terms under it", () => {
    render(<Playground />);
    const signIn = screen.getByRole("link", { name: "Sign in" });
    expect(signIn).toHaveAttribute("href", "/login");
    expect(screen.getByText("Already have an account?")).toBeInTheDocument();
    expect(signIn.closest(".overflow-hidden")).not.toBeNull();
    const terms = screen.getByRole("link", { name: "Terms of Service" });
    expect(terms.closest(".overflow-hidden")).toBeNull();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
  });

  it("submits the account without the confirmation", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await fillEmail(user);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "",
        username: "",
        email: "ada@acme.com",
        password: "a-long-password",
      }),
    );
  });

  it("does not submit empty fields", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit when the passwords differ", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await fillEmail(user);
    await user.type(screen.getByLabelText(/^Repeat the password/), "x");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByText("The passwords do not match.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("does not submit a short password", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await fillEmail(user, "short");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findAllByText(/use at least 8 characters/i)).not.toHaveLength(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("asks for the name and the username too, when the fields say so", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AllFields onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^Name/), "Ada Lovelace");
    await user.type(screen.getByLabelText(/^Username/), "ada");
    await fillEmail(user);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    await vi.waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith({
        name: "Ada Lovelace",
        username: "ada",
        email: "ada@acme.com",
        password: "a-long-password",
      }),
    );
    expect(screen.getByText("At least 10 characters.")).toBeInTheDocument();
  });

  it("shows the error the handler returns", async () => {
    const user = userEvent.setup();
    render(<ServerError />);

    await fillEmail(user);
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("That email is taken.");
  });

  it("fits one column without an image, and can be a single card", () => {
    const { unmount } = render(<WithoutImage />);
    expect(screen.queryByRole("complementary", { hidden: true })).toBeNull();
    unmount();
    const { container } = render(<SingleCard />);
    expect(container.querySelector("[data-variant='card']")).not.toBeNull();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <RegisterPage onSubmit={vi.fn()} loginHref="/login" />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading", { name: "Crie sua conta" })).toBeInTheDocument();
    expect(screen.getByText("Já tem conta?")).toBeInTheDocument();
  });
});
