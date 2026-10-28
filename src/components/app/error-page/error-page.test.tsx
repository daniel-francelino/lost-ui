import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LostI18nProvider, lostI18n } from "../../../i18n";
import { ErrorPage } from "./error-page";
import * as stories from "./error-page.stories";

const {
  Playground,
  WithIcon,
  ServerError,
  CustomStatusMessage,
  WithoutStatusCode,
  CustomClearButton,
  WithoutClearButton,
  OnClear,
  WithLeadingAndContent,
} = composeStories(stories);

afterEach(async () => {
  await lostI18n.changeLanguage("en");
});

describe("ErrorPage", () => {
  it("is the main landmark", () => {
    render(<Playground />);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("shows the status code, the message of the code and the message of the error", () => {
    render(<Playground />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByText("The page you are looking for does not exist.")).toBeInTheDocument();
  });

  it.each([
    [401, "Unauthorized"],
    [403, "Forbidden"],
    [404, "Page not found"],
    [500, "Server error"],
    [503, "Service unavailable"],
    [418, "Something went wrong"],
  ])("writes a message for the code %s", (statusCode, text) => {
    render(<ErrorPage error={{ statusCode }} />);
    expect(screen.getByRole("heading", { name: text })).toBeInTheDocument();
  });

  it("writes the message in the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <ErrorPage error={{ statusCode: 404 }} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading", { name: "Página não encontrada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar ao início" })).toBeInTheDocument();
  });

  it("uses the status message of the error over the one of the code", () => {
    render(<CustomStatusMessage />);
    expect(screen.getByRole("heading", { name: "I am a teapot" })).toBeInTheDocument();
    expect(screen.getByText("Short and stout.")).toBeInTheDocument();
  });

  it("shows a server error", () => {
    render(<ServerError />);
    expect(screen.getByRole("heading", { name: "Server error" })).toBeInTheDocument();
  });

  it("works without a status code", () => {
    render(<WithoutStatusCode />);
    expect(screen.queryByText(/^\d+$/)).toBeNull();
    expect(screen.getByRole("heading", { name: "Something went wrong" })).toBeInTheDocument();
  });

  it("shows an icon and hides it from screen readers", () => {
    const { container } = render(<WithIcon />);
    expect(container.querySelector("span[aria-hidden='true'] svg")).not.toBeNull();
  });

  it("leads back to the home page by default", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
  });

  it("can customise the button and where it goes", () => {
    render(<CustomClearButton />);
    const link = screen.getByRole("link", { name: "Take me home" });
    expect(link).toHaveAttribute("href", "/home");
    expect(link).toHaveClass("border");
  });

  it("can hide the button", () => {
    render(<WithoutClearButton />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("calls onClear when the button is clicked", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<OnClear onClear={onClear} />);

    await user.click(screen.getByRole("link", { name: "Back to home" }));

    expect(onClear).toHaveBeenCalledOnce();
  });

  it("shows content above and below the message", () => {
    render(<WithLeadingAndContent />);
    expect(screen.getByText("◆ lost-ui")).toBeInTheDocument();
    expect(screen.getByText("Error id: 4f3a")).toBeInTheDocument();
  });

  it("uses the heading level it is given", () => {
    render(<Playground headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("fills the screen under the header", () => {
    render(<Playground />);
    expect(screen.getByRole("main")).toHaveClass("min-h-[calc(100vh-var(--header-height,0px))]");
  });
});
