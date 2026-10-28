import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./reset-password-page.stories";

const { Playground, ServerError } = composeStories(stories);

describe("ResetPasswordPage", () => {
  it("asks for the new password twice", () => {
    render(<Playground />);
    expect(screen.getByRole("heading", { name: "Choose a new password" })).toBeInTheDocument();
    expect(screen.getByLabelText(/^New password/)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Repeat the password/)).toBeInTheDocument();
  });

  it("saves the password when both match", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^New password/), "a-long-password");
    await user.type(screen.getByLabelText(/^Repeat the password/), "a-long-password");
    await user.click(screen.getByRole("button", { name: "Save the password" }));

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ password: "a-long-password" }));
  });

  it("does not save when they differ", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/^New password/), "a-long-password");
    await user.type(screen.getByLabelText(/^Repeat the password/), "another-password");
    await user.click(screen.getByRole("button", { name: "Save the password" }));

    expect(await screen.findByText("The passwords do not match.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows the error the handler returns", async () => {
    const user = userEvent.setup();
    render(<ServerError />);

    await user.type(screen.getByLabelText(/^New password/), "a-long-password");
    await user.type(screen.getByLabelText(/^Repeat the password/), "a-long-password");
    await user.click(screen.getByRole("button", { name: "Save the password" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("The link has expired.");
  });
});
