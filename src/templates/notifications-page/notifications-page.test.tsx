import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../i18n";
import { NotificationsPage } from "./notifications-page";
import * as stories from "./notifications-page.stories";

const { Playground, WithKinds, Loading, ErrorState, Empty, EmptyUnread, HasMore, LoadingMore } =
  composeStories(stories);

describe("NotificationsPage", () => {
  it("shows the title and how many are unread", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 1, name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByText("1 to read.")).toBeInTheDocument();
  });

  it("says when everything was read", () => {
    render(<Playground unreadCount={0} />);
    expect(screen.getByText("You are all caught up.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Mark all as read" })).toBeNull();
  });

  it("marks all as read", async () => {
    const user = userEvent.setup();
    const onReadAll = vi.fn();
    render(<Playground onReadAll={onReadAll} />);
    await user.click(screen.getByRole("button", { name: "Mark all as read" }));
    expect(onReadAll).toHaveBeenCalledOnce();
  });

  it("groups the list by day", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 2, name: "Today" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Yesterday" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("passes the actions to each row", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    const onRead = vi.fn();
    render(<Playground onOpen={onOpen} onRead={onRead} />);

    await user.click(screen.getByRole("button", { name: /New access request/ }));
    await user.click(screen.getAllByRole("button", { name: "Mark as read" })[0]!);

    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
    expect(onRead).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
  });

  it("reports the filter chosen", async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();
    render(<Playground onFilterChange={onFilterChange} />);
    await user.click(screen.getByRole("tab", { name: "Unread" }));
    expect(onFilterChange).toHaveBeenCalledWith("unread");
    expect(screen.getByRole("tab", { name: "Unread" })).toHaveAttribute("aria-selected", "true");
  });

  it("can hide the snoozed tab", () => {
    render(<Playground snoozeFilter={false} />);
    expect(screen.queryByRole("tab", { name: "Snoozed" })).toBeNull();
  });

  it("shows a select of the types when there are two or more", () => {
    const { unmount } = render(<WithKinds />);
    expect(screen.getByRole("combobox", { name: "Type of notification" })).toBeInTheDocument();
    unmount();
    render(<Playground />);
    expect(screen.queryByRole("combobox")).toBeNull();
  });

  it("shows skeletons while loading", () => {
    render(<Loading />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("shows the error and retries", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    expect(screen.getByText("Could not load the notifications")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it("shows an empty state that follows the filter", () => {
    const { unmount } = render(<Empty />);
    expect(screen.getByText("No notifications yet")).toBeInTheDocument();
    unmount();
    render(<EmptyUnread />);
    expect(screen.getByText("No unread notifications")).toBeInTheDocument();
  });

  it("loads more", async () => {
    const user = userEvent.setup();
    const onLoadMore = vi.fn();
    render(<HasMore onLoadMore={onLoadMore} />);
    await user.click(screen.getByRole("button", { name: "Load more" }));
    expect(onLoadMore).toHaveBeenCalledOnce();
  });

  it("disables load more while it loads", () => {
    render(<LoadingMore />);
    expect(screen.getByRole("button", { name: "Load more" })).toBeDisabled();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <NotificationsPage notifications={[]} unreadCount={0} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading", { name: "Notificações" })).toBeInTheDocument();
    expect(screen.getByText("Está tudo em dia.")).toBeInTheDocument();
  });

  it("takes a row out when it leaves the list", async () => {
    const { rerender } = render(<Playground />);
    expect(screen.getByText("Order shipped")).toBeInTheDocument();

    const [first] = Playground.args.notifications!;
    rerender(<Playground notifications={[first!]} />);

    await vi.waitFor(() => expect(screen.queryByText("Order shipped")).toBeNull());
    expect(screen.getByText("New access request")).toBeInTheDocument();
  });
});
