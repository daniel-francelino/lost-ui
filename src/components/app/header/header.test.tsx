import { composeStories } from "@storybook/react-vite";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./header.stories";

const {
  Playground,
  Slideover,
  ToggleOnTheLeft,
  WithLogo,
  CustomLeft,
  WithoutMenu,
  HiddenToggle,
  CustomMenu,
} = composeStories(stories);

const slot = (name: string) => document.querySelector(`[data-slot="${name}"]`);

describe("Header", () => {
  it("is the banner landmark with a link to the site named after the title", () => {
    render(<Playground />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "lost-ui" })).toHaveAttribute("href", "/");
  });

  it("takes the address of the title link", () => {
    render(<Playground href="/home" />);
    expect(screen.getByRole("link", { name: "lost-ui" })).toHaveAttribute("href", "/home");
  });

  it("shows the menu in the middle and the actions at the end", () => {
    render(<Playground />);
    expect(
      within(slot("header-center") as HTMLElement).getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(
      within(slot("header-right") as HTMLElement).getByRole("button", { name: "GitHub" }),
    ).toBeInTheDocument();
  });

  it("hides the middle on small screens and the toggle on large ones", () => {
    render(<Playground />);
    expect(slot("header-center")).toHaveClass("hidden", "lg:flex");
    expect(slot("header-toggle")).toHaveClass("lg:hidden");
  });

  it("is sticky and as tall as --header-height", () => {
    render(<Playground />);
    expect(screen.getByRole("banner")).toHaveClass(
      "sticky",
      "top-0",
      "h-[var(--header-height,4rem)]",
    );
  });

  it("opens the menu with the toggle and closes it with the same button", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = await screen.findByRole("dialog", { name: "lost-ui" });
    expect(within(dialog).getByRole("navigation", { name: "Mobile" })).toBeInTheDocument();
  });

  it("tells the state of the toggle", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("reports the open state", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it("starts open with defaultOpen and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<Playground defaultOpen />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes the menu when a link inside it is followed", async () => {
    const user = userEvent.setup();
    render(<Playground defaultOpen />);

    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Docs" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("keeps the menu open after a link when autoClose is off", async () => {
    const user = userEvent.setup();
    render(<Playground defaultOpen autoClose={false} />);

    await user.click(within(screen.getByRole("dialog")).getByRole("link", { name: "Docs" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes the menu when the page moves", () => {
    render(<Playground defaultOpen />);

    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("can be driven from outside", () => {
    const { rerender } = render(<Playground open />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(<Playground open={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens the menu as a slideover from the side of the toggle", () => {
    const { unmount } = render(<Slideover defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "right");
    unmount();

    render(<ToggleOnTheLeft defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "left");
  });

  it("puts the toggle at the start when toggleSide is left", () => {
    render(<ToggleOnTheLeft />);
    expect(
      within(slot("header-left") as HTMLElement).getByRole("button", { name: "Open menu" }),
    ).toBeInTheDocument();
  });

  it("shows a logo in the title link and keeps its name", () => {
    render(<WithLogo />);
    const link = screen.getByRole("link", { name: "lost-ui" });
    expect(link).toHaveTextContent("◆ lost-ui");
  });

  it("lets the app replace the title link", () => {
    render(<CustomLeft />);
    expect(screen.getByText("Custom start")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "lost-ui" })).toBeNull();
  });

  it("has no toggle without a menu", () => {
    render(<WithoutMenu />);
    expect(screen.queryByRole("button", { name: "Open menu" })).toBeNull();
  });

  it("can hide the toggle", () => {
    render(<HiddenToggle />);
    expect(screen.queryByRole("button", { name: "Open menu" })).toBeNull();
  });

  it("lets the app draw the whole menu", () => {
    render(<CustomMenu defaultOpen />);
    expect(screen.getByText("Your own menu.")).toBeInTheDocument();
  });

  it("names the toggle in the current language", async () => {
    const { lostI18n } = await import("../../../i18n");
    const { LostI18nProvider } = await import("../../../i18n");
    const { Header } = await import("./header");
    render(
      <LostI18nProvider language="pt">
        <Header title="Site" body={<p>menu</p>} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Abrir menu" })).toBeInTheDocument();
    await lostI18n.changeLanguage("en");
  });
});
