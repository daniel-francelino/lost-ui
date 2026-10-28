import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import * as stories from "./notification-button.stories";

const { Playground, NoUnread, OverTheLimit, AsLink } = composeStories(stories);

describe("NotificationButton", () => {
  it("shows the count and tells screen readers it is unread", () => {
    render(<Playground />);
    const button = screen.getByRole("button", { name: "Notifications" });
    expect(button).toHaveTextContent("3");
    expect(button).toHaveTextContent("3 unread");
  });

  it("shows no badge for 0", () => {
    render(<NoUnread />);
    expect(screen.getByRole("button", { name: "Notifications" })).not.toHaveTextContent(/\d/);
  });

  it("caps the badge", () => {
    render(<OverTheLimit />);
    expect(screen.getByRole("button", { name: "Notifications" })).toHaveTextContent("9+");
  });

  it("calls onClick", async () => {
    const user = userEvent.setup();
    const onClick = Playground.args.onClick as ReturnType<typeof import("vitest").vi.fn>;
    render(<Playground />);
    await user.click(screen.getByRole("button", { name: "Notifications" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is a link when it has an address", () => {
    render(<AsLink />);
    expect(screen.getByRole("link", { name: "Notifications" })).toHaveAttribute(
      "href",
      "/notifications",
    );
  });
});
