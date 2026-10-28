import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./profile-page.stories";

const { Playground, WithoutPassword, ServerError, WithNotifications } = composeStories(stories);

describe("ProfilePage", () => {
  it("shows the title, the description and the name", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { level: 1, name: "My profile" })).toBeInTheDocument();
    expect(screen.getByText("@ada · ada@acme.com · Owner")).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveValue("Ada Lovelace");
  });

  it("only lets the name be saved once it changes", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    expect(screen.getByRole("button", { name: "Save the name" })).toBeDisabled();

    await user.type(screen.getByLabelText(/^Name/), "!");

    expect(screen.getByRole("button", { name: "Save the name" })).toBeEnabled();
  });

  it("saves the trimmed name and confirms it", async () => {
    const user = userEvent.setup();
    const onSaveName = vi.fn();
    render(<Playground onSaveName={onSaveName} />);

    const input = screen.getByLabelText(/^Name/);
    await user.clear(input);
    await user.type(input, "  Grace Hopper ");
    await user.click(screen.getByRole("button", { name: "Save the name" }));

    await vi.waitFor(() => expect(onSaveName).toHaveBeenCalledWith("Grace Hopper"));
  });

  it("shows the error of the server for the name", async () => {
    const user = userEvent.setup();
    render(<ServerError />);

    await user.type(screen.getByLabelText(/^Name/), "x");
    await user.click(screen.getByRole("button", { name: "Save the name" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("That name is not allowed.");
  });

  it("does not save an empty name", async () => {
    const user = userEvent.setup();
    const onSaveName = vi.fn();
    render(<Playground onSaveName={onSaveName} />);

    await user.clear(screen.getByLabelText(/^Name/));
    await user.click(screen.getByRole("button", { name: "Save the name" }));

    expect(await screen.findAllByText(/required/i)).not.toHaveLength(0);
    expect(onSaveName).not.toHaveBeenCalled();
  });

  it("changes the password when both fields match, and clears them", async () => {
    const user = userEvent.setup();
    const onChangePassword = vi.fn();
    render(<Playground onChangePassword={onChangePassword} />);

    await user.type(screen.getByLabelText(/^New password/), "a-long-password");
    await user.type(screen.getByLabelText(/^Repeat the password/), "a-long-password");
    await user.click(screen.getByRole("button", { name: "Change the password" }));

    await vi.waitFor(() =>
      expect(onChangePassword).toHaveBeenCalledWith({ password: "a-long-password" }),
    );
    await vi.waitFor(() => expect(screen.getByLabelText(/^New password/)).toHaveValue(""));
  });

  it("does not change the password when they differ", async () => {
    const user = userEvent.setup();
    const onChangePassword = vi.fn();
    render(<Playground onChangePassword={onChangePassword} />);

    await user.type(screen.getByLabelText(/^New password/), "a-long-password");
    await user.type(screen.getByLabelText(/^Repeat the password/), "other-password");
    await user.click(screen.getByRole("button", { name: "Change the password" }));

    expect(await screen.findByText("The passwords do not match.")).toBeInTheDocument();
    expect(onChangePassword).not.toHaveBeenCalled();
  });

  it("hides the password section without onChangePassword", () => {
    render(<WithoutPassword />);
    expect(screen.queryByLabelText(/^New password/)).toBeNull();
  });

  it("shows the sections the app adds", () => {
    render(<WithNotifications />);
    expect(screen.getByRole("heading", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
  });
});
