import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { ChatMessage } from "./chat-message";
import * as stories from "./chat-message.stories";

const {
  Playground,
  FromTheUser,
  Variants,
  WithAvatar,
  WithActions,
  Compact,
  Reasoning,
  StreamingReasoning,
  ToolCalls,
  FilesAndSources,
  CustomText,
} = composeStories(stories);

const article = (container: HTMLElement) =>
  container.querySelector("[data-slot='chat-message']") as HTMLElement;

describe("ChatMessage", () => {
  it("is an article that says who spoke, for screen readers", () => {
    const { container } = render(<Playground />);
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByText("The assistant said:")).toHaveClass("sr-only");
    expect(article(container)).toHaveAttribute("data-role", "assistant");
  });

  it("shows the assistant with no bubble, on the left", () => {
    const { container } = render(<Playground />);
    expect(article(container)).toHaveAttribute("data-variant", "naked");
    expect(article(container)).toHaveAttribute("data-side", "left");
    expect(screen.getByText(/plan for the launch week/)).toBeInTheDocument();
  });

  it("shows the user in a soft bubble, on the right", () => {
    const { container } = render(<FromTheUser />);
    expect(screen.getByText("You said:")).toBeInTheDocument();
    expect(article(container)).toHaveAttribute("data-variant", "soft");
    expect(article(container)).toHaveAttribute("data-side", "right");
    expect(article(container)).toHaveClass("flex-row-reverse");
    expect(container.querySelector("[data-slot='chat-message-body']")).toHaveClass("bg-muted");
  });

  it("has five bubble styles", () => {
    const { container } = render(<Variants />);
    const styles = [...container.querySelectorAll("[data-slot='chat-message']")].map((node) =>
      node.getAttribute("data-variant"),
    );
    expect(styles).toEqual(["solid", "soft", "outline", "subtle", "naked"]);
  });

  it("shows an avatar and a header", () => {
    const { container } = render(<WithAvatar />);
    expect(container.querySelector("svg.lucide-bot")).not.toBeNull();
    expect(screen.getByText("Aura · 10:42")).toBeInTheDocument();
  });

  it("shows the actions under the message, named for screen readers, and calls them", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChatMessage
        role="assistant"
        parts={[{ type: "text", text: "Hi" }]}
        actions={[{ label: "Copy", icon: <i />, onClick }]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("reveals the actions on hover and focus, and always on touch screens", () => {
    const { container } = render(<WithActions />);
    expect(screen.getAllByRole("button")).toHaveLength(4);
    expect(container.querySelector("[data-slot='chat-message-actions']")).toHaveClass(
      "opacity-0",
      "group-hover/message:opacity-100",
      "focus-within:opacity-100",
      "pointer-coarse:opacity-100",
    );
  });

  it("is tighter when compact", () => {
    const { container } = render(<Compact />);
    expect(container.querySelector("[data-slot='chat-message-body']")).toHaveClass(
      "text-sm",
      "px-3",
    );
  });

  it("draws a reasoning part as a block that opens", () => {
    render(<Reasoning />);
    expect(screen.getByRole("button", { name: /Thought/ })).toBeInTheDocument();
    expect(screen.getByText(/I suggest Instagram/)).toBeInTheDocument();
  });

  it("shimmers the reasoning of a message that is still streaming", () => {
    const { container } = render(<StreamingReasoning />);
    expect(container.querySelector("[data-slot='chat-shimmer']")).toHaveTextContent("Thinking…");
    expect(screen.getByText(/Looking at the audience/)).toBeInTheDocument();
  });

  it("draws the tool calls with the state of each", () => {
    const { container } = render(<ToolCalls />);
    const tools = [...container.querySelectorAll("[data-slot='chat-tool']")];
    expect(tools.map((tool) => tool.getAttribute("data-state"))).toEqual([
      "done",
      "loading",
      "error",
    ]);
    expect(screen.getByRole("button", { name: /Searched the web/ })).toBeInTheDocument();
    expect(screen.getByText("Publishing")).toHaveClass("text-destructive");
  });

  it("shows the output and the error of a tool when it is opened", async () => {
    const user = userEvent.setup();
    render(<ToolCalls />);
    await user.click(screen.getByRole("button", { name: /Searched the web/ }));
    expect(screen.getByText(/"results": 3/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Publishing/ }));
    expect(screen.getByText("No access")).toBeInTheDocument();
  });

  it("draws files and sources", () => {
    render(<FilesAndSources />);
    expect(screen.getByText("brief.pdf")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /How to plan a launch/ });
    expect(link).toHaveAttribute("href", "https://example.com/post");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });

  it("draws an image file as a picture", () => {
    render(
      <ChatMessage
        role="user"
        parts={[{ type: "file", mediaType: "image/png", url: "/a.png", filename: "a.png" }]}
      />,
    );
    expect(screen.getByRole("img", { name: "a.png" })).toHaveAttribute("src", "/a.png");
  });

  it("lets the app draw the text, e.g. Markdown", () => {
    render(<CustomText />);
    expect(screen.getByText("bold").tagName).toBe("STRONG");
  });

  it("lets the app draw a part, and falls back to the default when it returns nothing", () => {
    render(
      <ChatMessage
        role="assistant"
        parts={[
          { type: "text", text: "Mine" },
          { type: "text", text: "Default" },
        ]}
        renderPart={(part) =>
          part.type === "text" && part.text === "Mine" ? <b>Custom</b> : undefined
        }
      />,
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.queryByText("Mine")).toBeNull();
    expect(screen.getByText("Default")).toBeInTheDocument();
  });

  it("tells the part renderers which part is the one being written", () => {
    const seen: boolean[] = [];
    render(
      <ChatMessage
        role="assistant"
        streaming
        parts={[
          { type: "text", text: "a" },
          { type: "text", text: "b" },
        ]}
        renderPart={(_part, context) => {
          seen.push(context.streaming);
          return <span />;
        }}
      />,
    );
    expect(seen).toEqual([false, true]);
  });

  it("takes children in place of the parts", () => {
    render(
      <ChatMessage role="user">
        <em>Custom content</em>
      </ChatMessage>,
    );
    expect(screen.getByText("Custom content")).toBeInTheDocument();
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <ChatMessage role="user" parts={[{ type: "text", text: "Oi" }]} />
      </LostI18nProvider>,
    );
    expect(screen.getByText("Você disse:")).toBeInTheDocument();
  });
});
