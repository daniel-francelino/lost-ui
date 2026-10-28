import { composeStories } from "@storybook/react-vite";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LostI18nProvider } from "../../../i18n";
import { ChatPrompt } from "./chat-prompt";
import * as stories from "./chat-prompt.stories";

const {
  Playground,
  Streaming,
  Failed,
  WithAttachments,
  EnterBreaksTheLine,
  WithFooter,
  WithHeader,
  Soft,
  Disabled,
  LongText,
} = composeStories(stories);

const box = () => screen.getByRole("textbox", { name: "Ask anything…" });

describe("ChatPrompt", () => {
  it("has a labelled textbox and a send button that waits for text", () => {
    render(<Playground />);
    expect(box()).toHaveAttribute("placeholder", "Ask anything…");
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("sends the text with Enter, trimmed, and clears the box", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);
    await user.type(box(), "  Plan a campaign  {Enter}");
    expect(onSubmit).toHaveBeenCalledWith("Plan a campaign", []);
    expect(box()).toHaveValue("");
  });

  it("breaks the line with Shift+Enter and does not send", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);
    await user.type(box(), "one{Shift>}{Enter}{/Shift}two");
    expect(onSubmit).not.toHaveBeenCalled();
    expect(box()).toHaveValue("one\ntwo");
  });

  it("sends with the button", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);
    await user.type(box(), "Hello");
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledWith("Hello", []);
  });

  it("does not send an empty text", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<Playground onSubmit={onSubmit} />);
    await user.type(box(), "   {Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("only sends with Ctrl+Enter when Enter breaks the line", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<EnterBreaksTheLine onSubmit={onSubmit} />);
    await user.type(box(), "Hi{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
    await user.type(box(), "there{Control>}{Enter}{/Control}");
    expect(onSubmit).toHaveBeenCalledWith("Hi\nthere", []);
  });

  it("does not send again while the answer comes, and the button stops it", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onStop = vi.fn();
    render(<Streaming onSubmit={onSubmit} onStop={onStop} />);
    await user.type(box(), "More{Enter}");
    expect(onSubmit).not.toHaveBeenCalled();
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

  it("can be controlled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ChatPrompt value="Fixed" onValueChange={onValueChange} />);
    expect(box()).toHaveValue("Fixed");
    await user.type(box(), "!");
    expect(onValueChange).toHaveBeenCalledWith("Fixed!");
    expect(box()).toHaveValue("Fixed");
  });

  it("tells the app when Esc is pressed and leaves the box", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Playground onClose={onClose} autoFocus />);
    expect(box()).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    expect(box()).not.toHaveFocus();
  });

  it("does not show the paperclip unless attachments are on", () => {
    const { unmount } = render(<Playground />);
    expect(screen.queryByRole("button", { name: "Attach files" })).toBeNull();
    unmount();
    render(<WithAttachments />);
    expect(screen.getByRole("button", { name: "Attach files" })).toBeInTheDocument();
  });

  it("attaches the files picked, lists them and sends them with the text", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const { container } = render(<WithAttachments onSubmit={onSubmit} />);
    const pdf = new File(["x"], "brief.pdf", { type: "application/pdf" });
    await user.upload(container.querySelector("input[type='file']") as HTMLInputElement, pdf);
    expect(screen.getByText("brief.pdf")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).toHaveBeenCalledWith("", [pdf]);
    expect(screen.queryByText("brief.pdf")).toBeNull();
  });

  it("removes an attached file", async () => {
    const user = userEvent.setup();
    const { container } = render(<WithAttachments />);
    await user.upload(
      container.querySelector("input[type='file']") as HTMLInputElement,
      new File(["x"], "brief.pdf", { type: "application/pdf" }),
    );
    await user.click(screen.getByRole("button", { name: "Remove brief.pdf" }));
    expect(screen.queryByText("brief.pdf")).toBeNull();
  });

  it("takes files dropped on the prompt, but only the types it accepts", () => {
    const { container } = render(<WithAttachments />);
    const form = container.querySelector("form") as HTMLFormElement;
    fireEvent.dragOver(form);
    expect(form).toHaveAttribute("data-dragging");
    fireEvent.drop(form, {
      dataTransfer: {
        files: [
          new File(["x"], "photo.png", { type: "image/png" }),
          new File(["x"], "notes.txt", { type: "text/plain" }),
        ],
      },
    });
    expect(form).not.toHaveAttribute("data-dragging");
    expect(screen.getByText("photo.png")).toBeInTheDocument();
    expect(screen.queryByText("notes.txt")).toBeNull();
  });

  it("takes files pasted into the box", () => {
    render(<WithAttachments />);
    fireEvent.paste(box(), {
      clipboardData: { files: [new File(["x"], "shot.png", { type: "image/png" })] },
    });
    expect(screen.getByText("shot.png")).toBeInTheDocument();
  });

  it("ignores files when attachments are off", () => {
    const { container } = render(<Playground />);
    fireEvent.drop(container.querySelector("form") as HTMLFormElement, {
      dataTransfer: { files: [new File(["x"], "a.png", { type: "image/png" })] },
    });
    expect(screen.queryByText("a.png")).toBeNull();
  });

  it("shows the footer and the header it is given", () => {
    const { unmount } = render(<WithFooter />);
    expect(screen.getByRole("button", { name: /Auto/ })).toBeInTheDocument();
    unmount();
    render(<WithHeader />);
    expect(screen.getByText(/Answering:/)).toBeInTheDocument();
  });

  it("can replace the send button", () => {
    render(<ChatPrompt submit={<button type="submit">Go</button>} />);
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send" })).toBeNull();
  });

  it("is dimmed and cannot be used when disabled", () => {
    const { container } = render(<Disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(container.querySelector("form")).toHaveClass("opacity-60");
  });

  it("has a variant without a border", () => {
    const { container } = render(<Soft />);
    expect(container.querySelector("form")).toHaveClass("bg-muted");
  });

  it("keeps a long text in a box that scrolls", () => {
    render(<LongText />);
    expect((box() as HTMLTextAreaElement).value).toContain("Line 12");
  });

  it("speaks the language set", () => {
    render(
      <LostI18nProvider language="pt">
        <ChatPrompt attachments />
      </LostI18nProvider>,
    );
    expect(screen.getByRole("textbox", { name: "Pergunte qualquer coisa…" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Anexar arquivos" })).toBeInTheDocument();
  });
});
