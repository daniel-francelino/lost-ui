import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./notification-item.stories";

const { Playground, Read, Urgent, Warning, NoActions } = composeStories(stories);

describe("NotificationItem", () => {
  it("shows the title, the text, the date and the kind of notice", () => {
    render(<Playground />);
    expect(screen.getByText("New access request")).toBeInTheDocument();
    expect(screen.getByText("Ada Lovelace asked for access.")).toBeInTheDocument();
    expect(screen.getByText("Notice")).toBeInTheDocument();
    expect(screen.getByText(/Jun 15, 2026/)).toBeInTheDocument();
  });

  it("marks the unread ones, for the eye and for screen readers", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-unread]")).not.toBeNull();
    expect(screen.getByText("(unread)")).toBeInTheDocument();
  });

  it("does not mark the read ones or offer to read them", () => {
    const { container } = render(<Read />);
    expect(container.querySelector("[data-unread]")).toBeNull();
    expect(screen.queryByText("(unread)")).toBeNull();
    expect(screen.queryByRole("button", { name: "Mark as read" })).toBeNull();
  });

  it("names the severity", () => {
    const { unmount } = render(<Urgent />);
    expect(screen.getByText("Urgent")).toBeInTheDocument();
    unmount();
    render(<Warning />);
    expect(screen.getByText("Attention")).toBeInTheDocument();
  });

  it("calls onOpen, onRead and onSnooze with the notification", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onRead = vi.fn();
    const onSnooze = vi.fn();
    render(<Playground onOpen={onOpen} onRead={onRead} onSnooze={onSnooze} />);

    await user.click(screen.getByRole("button", { name: /New access request/ }));
    await user.click(screen.getByRole("button", { name: "Mark as read" }));
    await user.click(screen.getByRole("button", { name: "Snooze until tomorrow" }));

    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
    expect(onRead).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
    expect(onSnooze).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
  });

  it("has no buttons when no handler is given", () => {
    render(<NoActions />);
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("New access request")).toBeInTheDocument();
  });
});
