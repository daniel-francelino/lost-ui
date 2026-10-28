import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider, lostI18n } from "../../../i18n";
import { Modal } from "./modal";
import * as stories from "./modal.stories";

const {
  Playground,
  WithFooter,
  WithActions,
  Controlled,
  NoCloseButton,
  NotDismissible,
  NoOverlay,
  NotModal,
  Fullscreen,
  Scrollable,
  NoTransition,
  KeepMounted,
  CustomHeader,
  CustomContent,
  FromTheSide,
  FromTheLeft,
} = composeStories(stories);

const openIt = async (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: "Open" }));

describe("Modal", () => {
  it("stays closed until it is opened", () => {
    render(<Playground />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens from its trigger with the title and the description", async () => {
    const user = userEvent.setup();
    render(<Playground />);

    await openIt(user);

    const dialog = await screen.findByRole("dialog", { name: "Delete project" });
    expect(dialog).toHaveAccessibleDescription("This action cannot be undone.");
    expect(screen.getByText("Everything inside the project will be removed.")).toBeInTheDocument();
  });

  it("reports the open state", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(<Playground onOpenChange={onOpenChange} />);

    await openIt(user);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    await user.click(await screen.findByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("starts open with defaultOpen", () => {
    render(<Playground defaultOpen />);
    expect(screen.getByRole("dialog", { name: "Delete project" })).toBeInTheDocument();
  });

  it("closes with Escape", async () => {
    const user = userEvent.setup();
    render(<Playground defaultOpen />);

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes with a click on the backdrop", async () => {
    const user = userEvent.setup();
    render(<Playground defaultOpen />);

    await user.click(document.querySelector('[data-slot="modal-overlay"]') as HTMLElement);

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("can be driven from outside", async () => {
    const user = userEvent.setup();
    render(<Controlled />);

    await user.click(screen.getByRole("button", { name: "Open from outside" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("follows the open prop", () => {
    const { rerender } = render(<Playground trigger={undefined} open />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(<Playground trigger={undefined} open={false} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows a footer and hands it the close function", async () => {
    const user = userEvent.setup();
    render(<WithFooter defaultOpen />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("shows actions next to the close button", () => {
    render(<WithActions defaultOpen />);
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("can hide the close button", () => {
    render(<NoCloseButton defaultOpen />);
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    expect(screen.getByRole("button", { name: "Got it" })).toBeInTheDocument();
  });

  it("names the close button in the current language or by prop", async () => {
    const { unmount } = render(
      <LostI18nProvider language="pt">
        <Modal defaultOpen title="Título" />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    unmount();
    await lostI18n.changeLanguage("en");

    render(<Modal defaultOpen title="Title" closeLabel="Dismiss" />);
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("stays open on Escape and on a click outside when it is not dismissible", async () => {
    const onClosePrevented = vi.fn();
    const user = userEvent.setup();
    render(<NotDismissible defaultOpen onClosePrevented={onClosePrevented} />);

    await user.keyboard("{Escape}");
    await user.click(document.querySelector('[data-slot="modal-overlay"]') as HTMLElement);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(onClosePrevented).toHaveBeenCalled();
  });

  it("can still be closed from inside when it is not dismissible", async () => {
    const user = userEvent.setup();
    render(<NotDismissible defaultOpen />);

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("draws a backdrop by default, and none without overlay or when not modal", () => {
    const { unmount } = render(<Playground defaultOpen />);
    expect(document.querySelector('[data-slot="modal-overlay"]')).not.toBeNull();
    unmount();

    const second = render(<NoOverlay defaultOpen />);
    expect(document.querySelector('[data-slot="modal-overlay"]')).toBeNull();
    second.unmount();

    render(<NotModal defaultOpen />);
    expect(document.querySelector('[data-slot="modal-overlay"]')).toBeNull();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("fills the screen when fullscreen", () => {
    render(<Fullscreen defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveClass("inset-0", "w-screen");
  });

  it("scrolls the whole panel when scrollable", () => {
    render(<Scrollable defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveClass("overflow-y-auto");
    expect(document.querySelector('[data-slot="modal-body"]')).not.toHaveClass("overflow-y-auto");
  });

  it("scrolls only the body by default", () => {
    render(<Playground defaultOpen />);
    expect(document.querySelector('[data-slot="modal-body"]')).toHaveClass("overflow-y-auto");
  });

  it("leaves out the animation without a transition", () => {
    const { unmount } = render(<Playground defaultOpen />);
    expect(screen.getByRole("dialog").className).toContain("animate-in");
    unmount();

    render(<NoTransition defaultOpen />);
    expect(screen.getByRole("dialog").className).not.toContain("animate-in");
  });

  it("keeps the content mounted when closed with unmountOnHide off", () => {
    render(<KeepMounted />);
    expect(document.querySelector('[data-slot="modal"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="modal"]')).toHaveAttribute("data-state", "closed");
  });

  it("lets the app draw the header", () => {
    render(<CustomHeader defaultOpen />);
    expect(screen.getByText("Custom header").tagName).toBe("STRONG");
  });

  it("lets the app draw the whole panel, with an accessible name from the title", () => {
    render(<CustomContent defaultOpen />);
    expect(screen.getByText("Everything in here is yours.")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Panel" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("slides in from an edge with side", () => {
    const { unmount } = render(<FromTheSide defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveAttribute("data-side", "right");
    expect(screen.getByRole("dialog")).toHaveClass("right-0", "border-l");
    unmount();

    render(<FromTheLeft defaultOpen />);
    expect(screen.getByRole("dialog")).toHaveClass("left-2", "rounded-lg");
  });

  it("has a name even without a title", () => {
    render(<Modal defaultOpen>Body</Modal>);
    expect(screen.getByRole("dialog", { name: "Dialog" })).toBeInTheDocument();
  });
});
