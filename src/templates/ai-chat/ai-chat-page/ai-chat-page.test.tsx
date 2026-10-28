import { composeStories } from "@storybook/react-vite";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { AiChatPage } from "./ai-chat-page";
import * as stories from "./ai-chat-page.stories";

const {
  Playground,
  NewChat,
  WaitingForTheAnswer,
  Streaming,
  Failed,
  WithDeleteAndAttachments,
  WithoutSidebar,
  NoConversations,
} = composeStories(stories);

afterEach(() => vi.restoreAllMocks());

const sidebar = () => screen.getByRole("complementary", { name: "Chat history" });

describe("AiChatPage", () => {
  it("fills its parent with the conversation and the prompt", () => {
    const { container } = render(<Playground />);
    expect(container.querySelector("[data-slot='ai-chat-page']")).toHaveClass("h-full", "flex");
    expect(screen.getByRole("log", { name: "Conversation" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Ask anything…" })).toBeInTheDocument();
    expect(screen.getByText(/Teaser posts on Instagram/)).toBeInTheDocument();
  });

  it("titles the page with the open conversation", () => {
    render(<Playground />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Launch campaign for the bakery" }),
    ).toBeInTheDocument();
  });

  it("lists the conversations under their headings, and marks the open one", () => {
    render(<Playground />);
    const list = within(sidebar());
    expect(list.getByRole("heading", { name: "Today" })).toBeInTheDocument();
    expect(list.getByRole("heading", { name: "Last week" })).toBeInTheDocument();
    expect(list.getByRole("button", { name: "Launch campaign for the bakery" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(list.getByRole("button", { name: "Captions for Instagram" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(list.getByRole("button", { name: "Untitled chat" })).toBeInTheDocument();
  });

  it("tells the app which conversation was picked, and when a new chat is wanted", async () => {
    const user = userEvent.setup();
    const onSelectConversation = vi.fn();
    const onNewConversation = vi.fn();
    render(
      <Playground
        onSelectConversation={onSelectConversation}
        onNewConversation={onNewConversation}
      />,
    );
    await user.click(within(sidebar()).getByRole("button", { name: "Monthly results summary" }));
    expect(onSelectConversation).toHaveBeenCalledWith("c3");
    await user.click(within(sidebar()).getByRole("button", { name: "New chat" }));
    expect(onNewConversation).toHaveBeenCalledOnce();
  });

  it("deletes a conversation when the app handles it", async () => {
    const user = userEvent.setup();
    const onDeleteConversation = vi.fn();
    render(<WithDeleteAndAttachments onDeleteConversation={onDeleteConversation} />);
    await user.click(
      within(sidebar()).getByRole("button", { name: "Delete Captions for Instagram" }),
    );
    expect(onDeleteConversation).toHaveBeenCalledWith("c2");
  });

  it("has no delete buttons when nothing handles them", () => {
    render(<Playground />);
    expect(screen.queryByRole("button", { name: /^Delete/ })).toBeNull();
  });

  it("welcomes the user in a new chat, with the suggestions", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<NewChat onSend={onSend} />);
    expect(
      screen.getByRole("heading", { level: 2, name: "How can I help you today?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ask about your brands, your calendar or your results."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("article")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Plan a launch campaign" }));
    expect(onSend).toHaveBeenCalledWith("Plan a launch campaign", []);
  });

  it("sends what the user writes", async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    render(<Playground onSend={onSend} />);
    await user.type(screen.getByRole("textbox"), "Write the first caption{Enter}");
    expect(onSend).toHaveBeenCalledWith("Write the first caption", []);
  });

  it("shows the small print under the prompt", () => {
    render(<Playground />);
    expect(screen.getByText(/can make mistakes/)).toBeInTheDocument();
  });

  it("shows that it is waiting for the answer, and lets the user stop while it streams", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    const { unmount } = render(<WaitingForTheAnswer />);
    expect(screen.getByText("Thinking…")).toBeInTheDocument();
    unmount();
    render(<Streaming onStop={onStop} />);
    await user.click(screen.getByRole("button", { name: "Stop" }));
    expect(onStop).toHaveBeenCalledOnce();
  });

  it("offers to try again after an error", async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();
    render(<Failed onReload={onReload} />);
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(onReload).toHaveBeenCalledOnce();
  });

  it("puts copy and regenerate under the answer, and regenerate only on the last one", async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();
    render(<Playground onReload={onReload} />);
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Regenerate" }));
    expect(onReload).toHaveBeenCalledOnce();
  });

  it("copies the text of the answer", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });
    render(<Playground />);
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Teaser posts on Instagram"));
  });

  it("lets the app set the buttons under the answers", () => {
    render(
      <Playground
        getActions={(message) =>
          message.role === "assistant"
            ? [{ label: "Share", icon: <i />, onClick: () => {} }]
            : undefined
        }
      />,
    );
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Copy" })).toBeNull();
  });

  it("opens the list of conversations in a drawer, and closes it when one is picked", async () => {
    const user = userEvent.setup();
    const onSelectConversation = vi.fn();
    render(<Playground onSelectConversation={onSelectConversation} />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open chat history" }));
    const drawer = screen.getByRole("dialog");
    await user.click(within(drawer).getByRole("button", { name: "Captions for Instagram" }));
    expect(onSelectConversation).toHaveBeenCalledWith("c2");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("leaves out the list and its button when the sidebar is off", () => {
    render(<WithoutSidebar />);
    expect(screen.queryByRole("complementary")).toBeNull();
    expect(screen.queryByRole("button", { name: "Open chat history" })).toBeNull();
    expect(
      screen.getByRole("heading", { level: 1, name: "Ask the assistant" }),
    ).toBeInTheDocument();
  });

  it("says when there are no conversations", () => {
    render(<NoConversations />);
    expect(screen.getByText("No conversations yet")).toBeInTheDocument();
  });

  it("can attach files when allowed", () => {
    render(<WithDeleteAndAttachments />);
    expect(screen.getByRole("button", { name: "Attach files" })).toBeInTheDocument();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <AiChatPage conversations={[]} onSend={() => {}} onNewConversation={() => {}} />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("heading", { name: "Como posso ajudar hoje?" })).toBeInTheDocument();
    expect(screen.getByText("Nenhuma conversa ainda")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Novo chat" })).toBeInTheDocument();
  });
});
