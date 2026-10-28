import { composeStories } from "@storybook/react-vite";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { ChatMessages } from "./chat-messages";
import * as stories from "./chat-messages.stories";

const {
  Playground,
  Streaming,
  WaitingForTheAnswer,
  Empty,
  WithPrompt,
  WithAvatarsAndActions,
  BubblesOnBothSides,
  CustomIndicator,
  LongConversation,
} = composeStories(stories);

const log = () => screen.getByRole("log", { name: "Conversation" });

/** jsdom has no layout: say how tall the list is and where it is scrolled. */
function layout(
  element: HTMLElement,
  { scrollHeight, clientHeight, scrollTop }: Record<string, number>,
) {
  Object.defineProperty(element, "scrollHeight", { configurable: true, value: scrollHeight });
  Object.defineProperty(element, "clientHeight", { configurable: true, value: clientHeight });
  element.scrollTop = scrollTop!;
}

describe("ChatMessages", () => {
  it("is a log with the messages in order", () => {
    render(<Playground />);
    expect(log()).toBeInTheDocument();
    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(4);
    expect(articles[0]).toHaveAttribute("data-role", "user");
    expect(articles[1]).toHaveAttribute("data-role", "assistant");
    expect(screen.getByText(/Plan a launch campaign/)).toBeInTheDocument();
  });

  it("puts the user on the right in a bubble and the assistant on the left with none", () => {
    render(<Playground />);
    const [first, second] = screen.getAllByRole("article");
    expect(first).toHaveAttribute("data-side", "right");
    expect(second).toHaveAttribute("data-variant", "naked");
  });

  it("draws the parts of each message: reasoning, tools and text", () => {
    render(<Playground />);
    expect(screen.getByRole("button", { name: /Thought/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Searched the web/ })).toBeInTheDocument();
    expect(screen.getByText(/Teaser posts on Instagram/)).toBeInTheDocument();
  });

  it("marks the log as busy while the answer comes, and shimmers its reasoning", () => {
    const { container } = render(<Streaming />);
    expect(log()).toHaveAttribute("aria-busy", "true");
    expect(container.querySelector("[data-slot='chat-shimmer']")).toBeInTheDocument();
  });

  it("shows an indicator while the answer has not started", () => {
    const { container } = render(<WaitingForTheAnswer />);
    expect(container.querySelector("[data-slot='chat-messages-indicator']")).toHaveTextContent(
      "Thinking…",
    );
  });

  it("does not show the indicator when it is not waiting", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-slot='chat-messages-indicator']")).toBeNull();
    expect(log()).toHaveAttribute("aria-busy", "false");
  });

  it("lets the app draw the indicator", () => {
    render(<CustomIndicator />);
    expect(screen.getByText("Writing the plan…")).toBeInTheDocument();
    expect(screen.queryByText("Thinking…")).toBeNull();
  });

  it("shows the empty state, centred, when there are no messages", () => {
    render(<Empty />);
    expect(screen.getByRole("heading", { name: "How can I help?" })).toBeInTheDocument();
    expect(screen.queryByRole("article")).toBeNull();
    expect(screen.getByRole("list", { name: "Suggestions" })).toBeInTheDocument();
  });

  it("keeps the footer under the list", () => {
    const { container } = render(<WithPrompt />);
    const footer = container.querySelector("[data-slot='chat-messages-footer']");
    expect(footer).toContainElement(screen.getByRole("textbox"));
    expect(log()).not.toContainElement(screen.getByRole("textbox"));
  });

  it("takes messages drawn by hand", () => {
    render(
      <ChatMessages>
        <p>By hand</p>
      </ChatMessages>,
    );
    expect(screen.getByText("By hand")).toBeInTheDocument();
  });

  it("gives each message the avatar and the actions of its role", async () => {
    const user = userEvent.setup();
    const { container } = render(<WithAvatarsAndActions />);
    expect(container.querySelectorAll("svg.lucide-bot")).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "Copy" })).toHaveLength(2);
    await user.click(screen.getAllByRole("button", { name: "Copy" })[0]!);
  });

  it("changes the bubbles by role", () => {
    render(<BubblesOnBothSides />);
    const [first, second] = screen.getAllByRole("article");
    expect(first).toHaveAttribute("data-variant", "solid");
    expect(second).toHaveAttribute("data-variant", "subtle");
  });

  it("goes to the bottom when it opens", () => {
    render(<LongConversation />);
    const viewport = log();
    layout(viewport, { scrollHeight: 2000, clientHeight: 400, scrollTop: 0 });
    // a new render of the same list scrolls again
    render(<LongConversation />);
    expect(screen.getAllByRole("log")[1]!.scrollTop).toBe(
      screen.getAllByRole("log")[1]!.scrollHeight,
    );
  });

  it("shows a button to go back to the latest message once the user scrolls up", () => {
    render(<LongConversation />);
    expect(screen.queryByRole("button", { name: "Scroll to the latest message" })).toBeNull();
    layout(log(), { scrollHeight: 2000, clientHeight: 400, scrollTop: 100 });
    fireEvent.scroll(log());
    expect(
      screen.getByRole("button", { name: "Scroll to the latest message" }),
    ).toBeInTheDocument();
  });

  it("goes back to the bottom with the button and hides it", async () => {
    const user = userEvent.setup();
    render(<LongConversation />);
    layout(log(), { scrollHeight: 2000, clientHeight: 400, scrollTop: 100 });
    fireEvent.scroll(log());
    await user.click(screen.getByRole("button", { name: "Scroll to the latest message" }));
    expect(log().scrollTop).toBe(2000);
    expect(screen.queryByRole("button", { name: "Scroll to the latest message" })).toBeNull();
  });

  it("does not show the button when it is turned off", () => {
    render(<LongConversation scrollButton={false} />);
    layout(log(), { scrollHeight: 2000, clientHeight: 400, scrollTop: 100 });
    fireEvent.scroll(log());
    expect(screen.queryByRole("button", { name: "Scroll to the latest message" })).toBeNull();
  });

  it("follows a new message when the user is at the bottom, and not when they scrolled up", () => {
    const { rerender } = render(<ChatMessages messages={[Playground.args.messages![0]!]} />);
    layout(log(), { scrollHeight: 1000, clientHeight: 400, scrollTop: 600 });
    fireEvent.scroll(log());
    layout(log(), { scrollHeight: 1200, clientHeight: 400, scrollTop: 600 });
    rerender(<ChatMessages messages={Playground.args.messages!.slice(0, 2)} />);
    expect(log().scrollTop).toBe(1200);

    layout(log(), { scrollHeight: 1200, clientHeight: 400, scrollTop: 100 });
    fireEvent.scroll(log());
    layout(log(), { scrollHeight: 1600, clientHeight: 400, scrollTop: 100 });
    rerender(
      <ChatMessages
        messages={Playground.args.messages!.slice(0, 3).slice(0, 2)}
        status="streaming"
      />,
    );
    expect(log().scrollTop).toBe(100);
  });

  it("goes down when the user sends a message, even if they were reading above", () => {
    const messages = Playground.args.messages!;
    const { rerender } = render(<ChatMessages messages={messages.slice(0, 2)} />);
    layout(log(), { scrollHeight: 1200, clientHeight: 400, scrollTop: 100 });
    fireEvent.scroll(log());
    layout(log(), { scrollHeight: 1500, clientHeight: 400, scrollTop: 100 });
    rerender(<ChatMessages messages={messages.slice(0, 3)} />);
    expect(log().scrollTop).toBe(1500);
  });

  it("scrolls smoothly when the browser can", async () => {
    const user = userEvent.setup();
    render(<LongConversation />);
    const scrollTo = vi.fn();
    Object.defineProperty(log(), "scrollTo", { configurable: true, value: scrollTo });
    layout(log(), { scrollHeight: 2000, clientHeight: 400, scrollTop: 100 });
    fireEvent.scroll(log());
    await user.click(screen.getByRole("button", { name: "Scroll to the latest message" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 2000, behavior: "smooth" });
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <ChatMessages messages={[]} status="submitted" />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("log", { name: "Conversa" })).toBeInTheDocument();
    expect(screen.getByText("Pensando…")).toBeInTheDocument();
    act(() => {});
  });
});
