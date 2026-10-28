import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { LoginPage } from "./login-page";
import * as stories from "./login-page.stories";

const {
  Playground,
  WithLogo,
  WithoutImage,
  WithoutProviders,
  UsernameOrEmail,
  ServerError,
  SingleCard,
  HalfScreen,
} = composeStories(stories);

type User = ReturnType<typeof userEvent.setup>;

async function fill(user: User) {
  await user.type(screen.getByLabelText(/^Email/), "ada@acme.com");
  await user.type(screen.getByLabelText(/^Password/), "secret");
}

describe("LoginPage", () => {
  it("is a card with the form and an image panel side by side", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-variant='split-card']")).not.toBeNull();
    expect(screen.getByRole("complementary", { hidden: true })).toBeInTheDocument();
  });

  it("shows the welcome heading, the description and the fields", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 1, name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByText("Login to your Acme Inc account")).toBeInTheDocument();
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("placeholder", "m@example.com");
    expect(screen.getByLabelText(/^Password/)).toBeInTheDocument();
  });

  it("does not mark the fields as required with an asterisk", () => {
    render(<Playground />);
    expect(screen.queryByText("*")).toBeNull();
  });

  it("puts the forgot password link on the line of the password label", () => {
    render(<Playground />);
    const link = screen.getByRole("link", { name: "Forgot your password?" });
    expect(link).toHaveAttribute("href", "/recover-password");
    expect(link.closest("[data-slot='form-field']")).toContainElement(
      screen.getByLabelText(/^Password/),
    );
  });

  it("shows the other ways in as icon buttons with a name for screen readers", () => {
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
      <LoginPage
        onSubmit={vi.fn()}
        providers={[{ id: "google", label: "Google", icon: <i />, onClick }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Continue with Google" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("leaves out the separator and the buttons without providers", () => {
    render(<WithoutProviders />);
    expect(screen.queryByText("Or continue with")).toBeNull();
    expect(screen.queryByRole("button", { name: /Continue with/ })).toBeNull();
  });

  it("puts the sign up line inside the card and the terms under it", () => {
    render(<Playground />);
    const signUp = screen.getByRole("link", { name: "Sign up" });
    expect(signUp).toHaveAttribute("href", "/register");
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(signUp.closest(".overflow-hidden")).not.toBeNull();
    const terms = screen.getByRole("link", { name: "Terms of Service" });
    expect(terms).toHaveAttribute("href", "/terms");
    expect(terms.closest(".overflow-hidden")).toBeNull();
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
  });

  it("can name the sign up link", () => {
    render(<Playground registerLabel="Request access" />);
    expect(screen.getByRole("link", { name: "Request access" })).toBeInTheDocument();
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
      expect(onSubmit).toHaveBeenCalledWith({ identifier: "ada@acme.com", password: "secret" }),
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

  it("takes a username as well as an email", () => {
    const { unmount } = render(<Playground />);
    expect(screen.getByLabelText(/^Email/)).toHaveAttribute("type", "email");
    unmount();
    render(<UsernameOrEmail />);
    expect(screen.getByLabelText(/^Email or username/)).toHaveAttribute("type", "text");
  });

  it("shows the logo above the heading", () => {
    render(<WithLogo />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("fits one column without an image", () => {
    const { container } = render(<WithoutImage />);
    expect(screen.queryByRole("complementary", { hidden: true })).toBeNull();
    expect(container.querySelector("[class*='md:grid-cols-2']")).toBeNull();
  });

  it("can be a single card or half of the screen", () => {
    const { container, unmount } = render(<SingleCard />);
    expect(container.querySelector("[data-variant='card']")).not.toBeNull();
    // on a plain page the sign up line and the terms are both under the card
    expect(screen.getByRole("link", { name: "Sign up" }).closest(".overflow-hidden")).toBeNull();
    unmount();
    const half = render(<HalfScreen />);
    expect(half.container.querySelector("[data-variant='split']")).not.toBeNull();
    expect(screen.getByText("Welcome back.")).toBeInTheDocument();
  });

  it("leaves out the links it has no address for", () => {
    render(
      <Playground forgotPasswordHref={undefined} registerHref={undefined} legal={undefined} />,
    );
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <LoginPage onSubmit={vi.fn()} forgotPasswordHref="/r" registerHref="/c" />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading", { name: "Bem-vindo de volta" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Esqueceu a senha?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cadastre-se" })).toBeInTheDocument();
  });
});
