import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { toast } from "./sonner";
import * as stories from "./sonner.stories";

const { Default, Kinds } = composeStories(stories);

describe("Sonner", () => {
  afterEach(() => {
    toast.dismiss();
  });

  it("renders the default story", () => {
    const { container } = render(<Default />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it("shows a toast when triggered", async () => {
    render(<Default />);
    await userEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(await screen.findByText("Event has been created")).toBeInTheDocument();
  });

  it.each([
    ["Success", "Saved", "success"],
    ["Error", "Could not save", "error"],
    ["Warning", "Unsaved changes", "warning"],
    ["Info", "New version available", "info"],
  ])("shows the %s kind with its own type and an icon", async (button, text, type) => {
    render(<Kinds />);

    await userEvent.click(screen.getByRole("button", { name: button }));

    const toast = (await screen.findByText(text)).closest("[data-sonner-toast]");
    expect(toast).toHaveAttribute("data-type", type);
    expect(toast).toHaveAttribute("data-rich-colors", "true");
    expect(toast?.querySelector("[data-icon] svg")).not.toBeNull();
  });

  it("shows a spinner while loading", async () => {
    render(<Kinds />);

    await userEvent.click(screen.getByRole("button", { name: "Loading" }));

    const toast = (await screen.findByText("Uploading")).closest("[data-sonner-toast]");
    expect(toast?.querySelector("[data-icon] svg")).toHaveClass("animate-spin");
  });

  it("takes the colours of each kind from the theme tokens", async () => {
    render(<Kinds />);

    await userEvent.click(screen.getByRole("button", { name: "Info" }));

    await screen.findByText("New version available");
    const style = document.querySelector("[data-sonner-toaster]")?.getAttribute("style") ?? "";

    expect(style).toContain("--success-bg: var(--success)");
    expect(style).toContain("--error-bg: var(--destructive)");
    expect(style).toContain("--warning-text: var(--warning-foreground)");
    expect(style).toContain("--info-bg: var(--info)");
  });
});
