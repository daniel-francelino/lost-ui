import { composeStories } from "@storybook/react-vite";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatTool } from "./chat-tool";
import * as stories from "./chat-tool.stories";

const { Playground, WithOutput, Running, Streaming, Failed, WithSuffix, Card } =
  composeStories(stories);

describe("ChatTool", () => {
  it("is one line of text when there is no output", () => {
    const { container } = render(<Playground />);
    expect(screen.getByText("Lint checks completed")).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector("[data-slot='chat-tool']")).toHaveAttribute(
      "data-state",
      "done",
    );
  });

  it("opens to show the output when there is one", async () => {
    const user = userEvent.setup();
    render(<WithOutput />);
    const trigger = screen.getByRole("button", { name: /Lint checks completed/ });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText(/24 files checked/)).toBeNull();
    await user.click(trigger);
    expect(screen.getByText(/24 files checked/)).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByText(/24 files checked/)).toBeNull();
  });

  it("shows a spinner while it runs", () => {
    const { container } = render(<Running />);
    expect(container.querySelector("svg.animate-spin")).not.toBeNull();
    expect(container.querySelector("[data-slot='chat-tool']")).toHaveAttribute(
      "data-state",
      "loading",
    );
  });

  it("shimmers the label while it is being written", () => {
    const { container } = render(<Streaming />);
    expect(container.querySelector("[data-slot='chat-shimmer']")).toHaveTextContent(
      "Searching components",
    );
  });

  it("shows the failure in red", () => {
    const { container } = render(<Failed />);
    expect(screen.getByText("Lint checks failed")).toHaveClass("text-destructive");
    expect(container.querySelector("svg.text-destructive")).not.toBeNull();
    expect(container.querySelector("[data-slot='chat-tool']")).toHaveAttribute(
      "data-state",
      "error",
    );
  });

  it("shows the suffix and the icon it is given", () => {
    const { container } = render(<WithSuffix />);
    expect(screen.getByText("“launch campaign ideas”")).toBeInTheDocument();
    expect(container.querySelector("svg.lucide-search")).not.toBeNull();
  });

  it("is a bordered block in the card variant, with the actions under the label", () => {
    const { container } = render(<Card />);
    expect(container.querySelector("[data-slot='chat-tool']")).toHaveClass("border", "rounded-lg");
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Deny" })).toBeInTheDocument();
  });

  it("reports the changes of its open state and can be controlled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <ChatTool text="Tool" open onOpenChange={onOpenChange}>
        Output
      </ChatTool>,
    );
    expect(screen.getByText("Output")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Tool/ }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("can start open", () => {
    render(
      <ChatTool text="Tool" defaultOpen>
        Output
      </ChatTool>,
    );
    expect(screen.getByText("Output")).toBeInTheDocument();
  });
});
