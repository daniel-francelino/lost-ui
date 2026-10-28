import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { NotFoundPage } from "./not-found-page";
import * as stories from "./not-found-page.stories";

const { Playground, WithoutHomeButton, CustomText } = composeStories(stories);

describe("NotFoundPage", () => {
  it("says the page does not exist", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByText("This page does not exist or was moved.")).toBeInTheDocument();
  });

  it("links back to home", () => {
    render(<Playground />);
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/admin");
  });

  it("has no button without an address", () => {
    render(<WithoutHomeButton />);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("takes custom texts", () => {
    render(<CustomText />);
    expect(screen.getByRole("heading", { name: "No such order" })).toBeInTheDocument();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <NotFoundPage homeHref="/" />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading", { name: "Página não encontrada" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voltar ao início" })).toBeInTheDocument();
  });
});
