import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { ChatPromptSubmit } from "./chat-prompt-submit";
import * as stories from "./chat-prompt-submit.stories";

const { Playground, Submitted, Streaming, Failed, Disabled, AllStates } = composeStories(stories);

describe("ChatPromptSubmit", () => {
  it("is a submit button that sends when the chat is ready", () => {
    render(<Playground />);
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("data-status", "ready");
    expect(button.querySelector("svg.lucide-arrow-up")).not.toBeNull();
  });

  it.each([
    ["submitted", Submitted],
    ["streaming", Streaming],
  ])("stops the answer while it is %s", async (_status, Story) => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(<Story onStop={onStop} />);
    const button = screen.getByRole("button", { name: "Stop" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.querySelector("svg.lucide-square")).not.toBeNull();
    await user.click(button);
    expect(onStop).toHaveBeenCalledOnce();
  });

  it("tries again after an error", async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();
    render(<Failed onReload={onReload} />);
    const button = screen.getByRole("button", { name: "Try again" });
    expect(button).toHaveAttribute("type", "button");
    await user.click(button);
    expect(onReload).toHaveBeenCalledOnce();
  });

  it("can be disabled", () => {
    render(<Disabled />);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("looks different in each state", () => {
    render(<AllStates />);
    expect(screen.getAllByRole("button")).toHaveLength(4);
    expect(screen.getByRole("button", { name: "Try again" })).toHaveClass("bg-destructive");
    expect(screen.getAllByRole("button", { name: "Stop" })).toHaveLength(2);
    for (const stop of screen.getAllByRole("button", { name: "Stop" })) {
      expect(stop).toHaveClass("bg-secondary");
    }
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="es">
        <ChatPromptSubmit />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Enviar" })).toBeInTheDocument();
  });
});
