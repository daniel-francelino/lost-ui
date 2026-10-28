import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./empty.stories";

const { Playground, WithActions, WithLink, WithAvatar, Loading, Variants, Sizes, WithContent } =
  composeStories(stories);

describe("Empty", () => {
  it("shows a title and a description", () => {
    render(<Playground />);
    expect(
      screen.getByRole("heading", { level: 2, name: "No projects found" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Create a project to get started.")).toBeInTheDocument();
  });

  it("uses the heading level it is given", () => {
    render(<Playground headingLevel={4} />);
    expect(screen.getByRole("heading", { level: 4 })).toBeInTheDocument();
  });

  it("hides the icon from screen readers", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector('[data-slot="empty-leading"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("shows an avatar instead of the icon", () => {
    render(<WithAvatar />);
    expect(screen.getByText("AL")).toBeInTheDocument();
  });

  it("runs the click of an action", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<WithActions actions={[{ label: "Create new", onClick }]} />);

    await user.click(screen.getByRole("button", { name: "Create new" }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it("shows several actions", () => {
    render(<WithActions />);
    expect(screen.getByRole("button", { name: "Create new" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Refresh" })).toBeInTheDocument();
  });

  it("renders an action with href as a link", () => {
    render(<WithLink />);
    expect(screen.getByRole("link", { name: "Read the guide" })).toHaveAttribute("href", "/guide");
  });

  it("can disable an action", () => {
    render(<WithActions actions={[{ label: "Create new", disabled: true }]} />);
    expect(screen.getByRole("button", { name: "Create new" })).toBeDisabled();
  });

  it("shows a spinner and says it is busy while loading", () => {
    const { container } = render(<Loading />);
    expect(container.firstElementChild).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector("svg.animate-spin")).not.toBeNull();
    expect(screen.getByText("Loading")).toHaveClass("sr-only");
  });

  it("tells the loading text in the current language", async () => {
    const { lostI18n } = await import("../../i18n");
    await lostI18n.changeLanguage("pt");

    render(<Loading />);
    expect(screen.getByText("Carregando")).toBeInTheDocument();

    await lostI18n.changeLanguage("en");
  });

  it("applies each variant", () => {
    const { container } = render(<Variants />);
    const variants = [...container.querySelectorAll("[data-slot='empty']")].map((node) =>
      node.getAttribute("data-variant"),
    );
    expect(variants).toEqual(["outline", "solid", "soft", "subtle", "naked"]);
  });

  it("applies each size", () => {
    const { container } = render(<Sizes />);
    const panels = container.querySelectorAll("[data-slot='empty']");
    expect(panels[0]).toHaveClass("p-3");
    expect(panels[4]).toHaveClass("p-12");
  });

  it("renders the content and the footer", () => {
    render(<WithContent />);
    expect(screen.getByText("Invite people from the settings.")).toBeInTheDocument();
    expect(screen.getByText("Need help? Contact support.")).toBeInTheDocument();
  });

  it("shows no heading without a title", () => {
    render(<Playground title={undefined} />);
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
