import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./user-menu.stories";

const { Playground, WithoutSignOut, CustomSignOutLabel } = composeStories(stories);

describe("UserMenu", () => {
  it("shows the name, the description and the first letter", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Ada Lovelace/ })).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("opens a menu with the email, the links and the sign out", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    expect(await screen.findByText("ada@acme.com")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "My profile" })).toHaveAttribute(
      "href",
      "/admin/profile",
    );
    expect(screen.getByRole("menuitem", { name: "Sign out" })).toBeInTheDocument();
  });

  it("calls onSignOut", async () => {
    const user = userEvent.setup();
    const onSignOut = vi.fn();
    render(<Playground onSignOut={onSignOut} />);
    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    await user.click(await screen.findByRole("menuitem", { name: "Sign out" }));
    expect(onSignOut).toHaveBeenCalledOnce();
  });

  it("has no sign out without onSignOut", async () => {
    const user = userEvent.setup();
    render(<WithoutSignOut />);
    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    await screen.findByText("ada@acme.com");
    expect(screen.queryByRole("menuitem", { name: "Sign out" })).toBeNull();
  });

  it("can name the sign out", async () => {
    const user = userEvent.setup();
    render(<CustomSignOutLabel />);
    await user.click(screen.getByRole("button", { name: /Ada Lovelace/ }));
    expect(await screen.findByRole("menuitem", { name: "Leave" })).toBeInTheDocument();
  });
});
