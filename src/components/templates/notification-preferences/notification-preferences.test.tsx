import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import * as stories from "./notification-preferences.stories";

const { Playground, Disabled, WithoutEmail, Empty } = composeStories(stories);

describe("NotificationPreferences", () => {
  it("shows a row per type with a switch per channel", () => {
    render(<Playground />);
    expect(screen.getByText("Access requests")).toBeInTheDocument();
    expect(screen.getByText("When someone asks for access.")).toBeInTheDocument();
    expect(screen.getAllByRole("switch")).toHaveLength(6);
  });

  it("shows the state of each switch", () => {
    render(<Playground />);
    expect(screen.getByRole("switch", { name: "Access requests: In the app" })).toBeChecked();
    expect(screen.getByRole("switch", { name: "Low stock: By email" })).not.toBeChecked();
  });

  it("reports the type and its channels when one changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Playground onChange={onChange} />);

    await user.click(screen.getByRole("switch", { name: "Low stock: By email" }));

    expect(onChange).toHaveBeenCalledWith("stock", { inApp: true, email: true });
  });

  it("turns email off together with the app being off", () => {
    render(<Playground />);
    expect(screen.getByRole("switch", { name: "Fairs: By email" })).toBeDisabled();
    expect(screen.getByRole("switch", { name: "Access requests: By email" })).toBeEnabled();
  });

  it("disables everything", () => {
    render(<Disabled />);
    for (const toggle of screen.getAllByRole("switch")) expect(toggle).toBeDisabled();
  });

  it("hides the email switches", () => {
    render(<WithoutEmail />);
    expect(screen.getAllByRole("switch")).toHaveLength(3);
    expect(screen.queryByText("By email")).toBeNull();
  });

  it("says when there is nothing to configure", () => {
    render(<Empty />);
    expect(screen.getByText("No notification can be configured yet.")).toBeInTheDocument();
    expect(screen.queryByRole("switch")).toBeNull();
  });
});
