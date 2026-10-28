import { composeStories } from "@storybook/react-vite";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { ChatReasoning } from "./chat-reasoning";
import * as stories from "./chat-reasoning.stories";

const { Playground, Streaming, WithDuration, WithIcon, StaysOpen } = composeStories(stories);

afterEach(() => vi.useRealTimers());

describe("ChatReasoning", () => {
  it("is closed by default, with the label of a finished thought", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Thought/ })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByText(/The user wants a plan/)).toBeNull();
  });

  it("opens and closes by hand", async () => {
    const user = userEvent.setup();
    render(<Playground />);
    await user.click(screen.getByRole("button", { name: /Thought/ }));
    expect(screen.getByText(/The user wants a plan/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Thought/ }));
    expect(screen.queryByText(/The user wants a plan/)).toBeNull();
  });

  it("opens by itself while it streams, with a shimmering label", () => {
    const { container } = render(<Streaming />);
    expect(screen.getByRole("button", { name: /Thinking/ })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(container.querySelector("[data-slot='chat-shimmer']")).not.toBeNull();
    expect(screen.getByText(/The user wants a plan/)).toBeInTheDocument();
  });

  it("closes after a short delay when the streaming ends, and says how long it took", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const { rerender } = render(<ChatReasoning text="Hmm" streaming autoCloseDelay={500} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");

    vi.setSystemTime(new Date("2026-01-01T00:00:07Z"));
    rerender(<ChatReasoning text="Hmm" streaming={false} autoCloseDelay={500} />);
    expect(screen.getByRole("button", { name: "Thought for 7s" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the choice of the user: it does not close what the user opened or closed itself", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    const { rerender } = render(<ChatReasoning text="Hmm" streaming />);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");

    rerender(<ChatReasoning text="Hmm" streaming={false} />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("stays open after streaming when the delay is zero, or closed when autoOpen is off", () => {
    const { unmount } = render(<ChatReasoning text="a" streaming autoCloseDelay={0} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    unmount();
    render(<ChatReasoning text="a" streaming autoOpen={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("uses the duration it is given", () => {
    render(<WithDuration />);
    expect(screen.getByRole("button", { name: "Thought for 12s" })).toBeInTheDocument();
    expect(screen.getByText(/The user wants a plan/)).toBeInTheDocument();
  });

  it("takes an icon and children in place of the text", () => {
    const { container } = render(<WithIcon />);
    expect(container.querySelector("svg.lucide-brain")).not.toBeNull();
    render(
      <ChatReasoning defaultOpen>
        <em>Custom body</em>
      </ChatReasoning>,
    );
    expect(screen.getByText("Custom body")).toBeInTheDocument();
  });

  it("can start open and reports the changes when it is controlled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<ChatReasoning text="Hmm" open onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole("button"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    render(<StaysOpen />);
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <ChatReasoning text="Hmm" duration={3} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("button", { name: "Pensou por 3 s" })).toBeInTheDocument();
  });
});
