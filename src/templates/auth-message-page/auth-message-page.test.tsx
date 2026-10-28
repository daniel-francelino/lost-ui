import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import * as stories from "./auth-message-page.stories";

const { PendingApproval, ConfirmEmail, TextOnly } = composeStories(stories);

describe("AuthMessagePage", () => {
  it("shows the title, the text and the actions", () => {
    render(<PendingApproval />);
    expect(
      screen.getByRole("heading", { name: "Your request is being reviewed" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/the team reviews the account/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Check again" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });

  it("hides the icon from screen readers", () => {
    const { container } = render(<PendingApproval />);
    expect(container.querySelector("span[aria-hidden='true'] svg")).not.toBeNull();
  });

  it("can have a link under the card", () => {
    render(<ConfirmEmail />);
    expect(screen.getByRole("link", { name: "Back to sign in" })).toBeInTheDocument();
  });

  it("works with only a title", () => {
    render(<TextOnly />);
    expect(screen.getByRole("heading", { name: "Account suspended" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
