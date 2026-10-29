import { composeStories } from "@storybook/react-vite";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { LostI18nProvider, lostI18n } from "../../../i18n";
import type { SlashItem } from "../editor-slash-menu";
import { RichTextEditor, type RichTextEditorHandle } from "./rich-text-editor";
import * as stories from "./rich-text-editor.stories";

const {
  Playground,
  WithContent,
  Plain,
  ReadOnly,
  WithImageUpload,
  SomeBlocks,
  Controlled,
  AsJson,
  YourOwnBlocks,
  YourOwnExtensions,
  WithoutToolbarsAndGrip,
} = composeStories(stories);

// the language test sets the language for the whole file: go back to English after each test
afterEach(() => lostI18n.changeLanguage("en"));

const textbox = () => screen.getByRole("textbox", { name: "Rich text editor" });

async function ready(handle: { current: RichTextEditorHandle | null }) {
  await waitFor(() => expect(handle.current?.editor).toBeTruthy());
  return handle.current!.editor!;
}

describe("RichTextEditor", () => {
  it("is a labelled textbox with a placeholder in the empty first line", async () => {
    const { container } = render(<Playground />);
    await waitFor(() => expect(textbox()).toBeInTheDocument());
    expect(textbox()).toHaveAttribute("aria-multiline", "true");
    expect(container.querySelector("p.is-editor-empty")).toHaveAttribute(
      "data-placeholder",
      "Write something, or press “/” for blocks…",
    );
  });

  it("takes the placeholder it is given", async () => {
    const { container } = render(<RichTextEditor placeholder="Type here" />);
    await waitFor(() =>
      expect(container.querySelector("p.is-editor-empty")).toHaveAttribute(
        "data-placeholder",
        "Type here",
      ),
    );
  });

  it("draws the blocks: headings, lists, tasks, callout, quote, table and toggle", async () => {
    const { container } = render(<WithContent />);
    await waitFor(() => expect(textbox().querySelector("h1")).toHaveTextContent("Launch plan"));
    expect(textbox().querySelector("h2")).toBeInTheDocument();
    expect(textbox().querySelectorAll("ul > li").length).toBeGreaterThanOrEqual(3);
    expect(container.querySelectorAll("ul[data-type='taskList'] > li")).toHaveLength(2);
    expect(
      container.querySelector("ul[data-type='taskList'] > li[data-checked='true']"),
    ).toBeTruthy();
    expect(container.querySelector("div[data-type='callout']")).toHaveAttribute("data-emoji", "💡");
    expect(textbox().querySelector("blockquote")).toBeInTheDocument();
    expect(textbox().querySelector("table th")).toHaveTextContent("Channel");
    expect(container.querySelector("[data-type='toggle']")).toBeInTheDocument();
  });

  it("opens and closes a toggle", async () => {
    const user = userEvent.setup();
    render(<WithContent />);
    const button = await screen.findByRole("button", { name: "Collapse" });
    expect(button).toHaveAttribute("aria-expanded", "true");
    await user.click(button);
    expect(screen.getByRole("button", { name: "Expand" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("reports the HTML when the content changes", async () => {
    const onValueChange = vi.fn();
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} onValueChange={onValueChange} />);
    const editor = await ready(ref);
    act(() => void editor.commands.insertContent("<h2>Hello</h2>"));
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.lastCall?.[0]).toContain("<h2>Hello</h2>");
  });

  it("follows the value when it is controlled, without reporting that change", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <RichTextEditor value="<p>One</p>" onValueChange={onValueChange} />,
    );
    await waitFor(() => expect(textbox()).toHaveTextContent("One"));
    rerender(<RichTextEditor value="<p>Two</p>" onValueChange={onValueChange} />);
    await waitFor(() => expect(textbox()).toHaveTextContent("Two"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("works as a controlled field in a story", async () => {
    render(<Controlled />);
    await waitFor(() => expect(textbox()).toHaveTextContent("Edit me"));
    expect(screen.getByText("<p>Edit me, the HTML is below.</p>")).toBeInTheDocument();
  });

  it("gives its content, sets it and clears it through the ref", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} defaultValue="<p>Start</p>" />);
    await ready(ref);
    expect(ref.current!.getHTML()).toBe("<p>Start</p>");
    act(() => ref.current!.setContent("<p>Other</p>"));
    expect(ref.current!.getHTML()).toBe("<p>Other</p>");
    act(() => ref.current!.clear());
    expect(ref.current!.getHTML()).toBe("<p></p>");
  });

  it("cannot be edited when read only, and has no toolbar", async () => {
    const { container } = render(<ReadOnly />);
    await waitFor(() => expect(textbox()).toHaveAttribute("contenteditable", "false"));
    expect(container.querySelector("[data-slot='editor-bubble-menu']")).toBeNull();
    expect(container.querySelector("[data-slot='editor-table-bar']")).toBeNull();
  });

  it("turns editable on and off", async () => {
    const { rerender } = render(<RichTextEditor editable={false} />);
    await waitFor(() => expect(textbox()).toHaveAttribute("contenteditable", "false"));
    rerender(<RichTextEditor editable />);
    await waitFor(() => expect(textbox()).toHaveAttribute("contenteditable", "true"));
  });

  it("is a box with a border, or plain", async () => {
    const { container, unmount } = render(<Playground />);
    expect(container.querySelector("[data-slot='rich-text-editor']")).toHaveClass(
      "rounded-xl",
      "border",
    );
    unmount();
    const plain = render(<Plain />);
    expect(plain.container.querySelector("[data-slot='rich-text-editor']")).not.toHaveClass(
      "border",
    );
    expect(plain.container.querySelector("[data-slot='rich-text-editor']")).toHaveAttribute(
      "data-surface",
      "plain",
    );
  });

  it("keeps the least height of the writing area", async () => {
    render(<RichTextEditor minHeight="20rem" />);
    await waitFor(() => expect(textbox()).toHaveStyle({ minHeight: "20rem" }));
  });

  it("opens the block menu when the user types a slash, and filters it", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/").run());
    const menu = await screen.findByRole("listbox", { name: "Blocks" });
    expect(menu).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Heading 1/ })).toBeInTheDocument();
    act(() => void editor.chain().focus().insertContent("tod").run());
    await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(1));
    expect(screen.getByRole("option", { name: /To-do list/ })).toBeInTheDocument();
  });

  it("says when no block matches", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/zzzz").run());
    expect(await screen.findByText("No blocks found")).toBeInTheDocument();
  });

  it("makes the block that is picked in the menu", async () => {
    const user = userEvent.setup();
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/head").run());
    await user.click(await screen.findByRole("option", { name: /Heading 2/ }));
    expect(ref.current!.getHTML()).toContain("<h2>");
    expect(ref.current!.getHTML()).not.toContain("/head");
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });

  it("picks with the keyboard: arrows move and Enter chooses", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/").run());
    await screen.findByRole("listbox");
    const selected = () =>
      screen.getAllByRole("option").findIndex((o) => o.ariaSelected === "true");
    expect(selected()).toBe(0);
    fireEvent.keyDown(textbox(), { key: "ArrowDown" });
    await waitFor(() => expect(selected()).toBe(1));
    fireEvent.keyDown(textbox(), { key: "Enter" });
    expect(ref.current!.getHTML()).toContain("<h1>");
  });

  it("closes the menu with Escape", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/").run());
    await screen.findByRole("listbox");
    fireEvent.keyDown(textbox(), { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull());
  });

  it("offers the image block only when it can upload", async () => {
    const ref = createRef<RichTextEditorHandle>();
    const { unmount } = render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/imag").run());
    expect(await screen.findByText("No blocks found")).toBeInTheDocument();
    unmount();
    const withUpload = createRef<RichTextEditorHandle>();
    render(<WithImageUpload ref={withUpload} />);
    const second = await ready(withUpload);
    act(() => void second.chain().focus().insertContent("/imag").run());
    expect(await screen.findByRole("option", { name: /Image/ })).toBeInTheDocument();
  });

  it("offers only the blocks it is told to", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<SomeBlocks ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/").run());
    await screen.findByRole("listbox");
    expect(screen.getAllByRole("option")).toHaveLength(5);
    expect(screen.queryByRole("option", { name: /Table/ })).toBeNull();
  });

  it("uploads the picked image and puts it in the text", async () => {
    const onUploadImage = vi.fn().mockResolvedValue("https://img.test/a.png");
    const ref = createRef<RichTextEditorHandle>();
    const { container } = render(<RichTextEditor ref={ref} onUploadImage={onUploadImage} />);
    await ready(ref);
    const file = new File(["x"], "a.png", { type: "image/png" });
    fireEvent.change(container.querySelector("[data-slot='rich-text-editor-image-input']")!, {
      target: { files: [file] },
    });
    await waitFor(() => expect(ref.current!.getHTML()).toContain('src="https://img.test/a.png"'));
    expect(onUploadImage).toHaveBeenCalledWith(file);
  });

  it("tells the app when an upload fails", async () => {
    const failure = new Error("no");
    const onUploadError = vi.fn();
    const ref = createRef<RichTextEditorHandle>();
    const { container } = render(
      <RichTextEditor
        ref={ref}
        onUploadImage={() => Promise.reject(failure)}
        onUploadError={onUploadError}
      />,
    );
    await ready(ref);
    fireEvent.change(container.querySelector("[data-slot='rich-text-editor-image-input']")!, {
      target: { files: [new File(["x"], "a.png", { type: "image/png" })] },
    });
    await waitFor(() => expect(onUploadError).toHaveBeenCalledWith(failure, expect.any(File)));
  });

  it("has a toolbar for the selected text that formats it", async () => {
    const user = userEvent.setup();
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} defaultValue="<p>Hello world</p>" />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().setTextSelection({ from: 1, to: 6 }).run());
    const bold = await screen.findByRole("button", { name: "Bold", hidden: true });
    await user.click(bold);
    expect(ref.current!.getHTML()).toBe("<p><strong>Hello</strong> world</p>");
    await user.click(screen.getByRole("button", { name: "Italic", hidden: true }));
    expect(ref.current!.getHTML()).toContain("<em>");
    await user.click(screen.getByRole("button", { name: "Highlight", hidden: true }));
    expect(ref.current!.getHTML()).toContain("<mark");
  });

  it("puts a link on the selected text", async () => {
    const user = userEvent.setup();
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} defaultValue="<p>Hello world</p>" />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().setTextSelection({ from: 1, to: 6 }).run());
    await user.click(await screen.findByRole("button", { name: "Link", hidden: true }));
    await user.type(
      screen.getByLabelText("Paste a link", { selector: "input" }),
      "https://example.com",
    );
    await user.click(screen.getByRole("button", { name: "Apply link", hidden: true }));
    expect(ref.current!.getHTML()).toContain('href="https://example.com"');
  });

  it("has a toolbar for tables that adds a row", async () => {
    const user = userEvent.setup();
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertTable({ rows: 2, cols: 2 }).run());
    const rows = () => ref.current!.editor!.view.dom.querySelectorAll("tr").length;
    expect(rows()).toBe(2);
    await user.click(await screen.findByRole("button", { name: "Add row below", hidden: true }));
    expect(rows()).toBe(3);
  });

  it("speaks the language set", async () => {
    render(
      <LostI18nProvider language="pt">
        <RichTextEditor />
      </LostI18nProvider>,
    );
    expect(
      await screen.findByRole("textbox", { name: "Editor de texto rico" }),
    ).toBeInTheDocument();
  });

  it("reads and writes the Tiptap document when the format is json", async () => {
    const onValueChange = vi.fn();
    const ref = createRef<RichTextEditorHandle>();
    render(
      <RichTextEditor
        ref={ref}
        format="json"
        defaultValue={{
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Hi" }] }],
        }}
        onValueChange={onValueChange}
      />,
    );
    const editor = await ready(ref);
    expect(textbox()).toHaveTextContent("Hi");
    act(() => void editor.commands.insertContent(" there"));
    const [doc] = onValueChange.mock.lastCall as [{ type: string }];
    expect(doc.type).toBe("doc");
    expect(JSON.stringify(doc)).toContain("there");
    expect(ref.current!.getJSON().type).toBe("doc");
    expect(ref.current!.getText()).toBe(" thereHi");
  });

  it("follows a json value from outside", async () => {
    const doc = (text: string) => ({
      type: "doc" as const,
      content: [{ type: "paragraph", content: [{ type: "text", text }] }],
    });
    const { rerender } = render(<RichTextEditor format="json" value={doc("One")} />);
    await waitFor(() => expect(textbox()).toHaveTextContent("One"));
    rerender(<RichTextEditor format="json" value={doc("Two")} />);
    await waitFor(() => expect(textbox()).toHaveTextContent("Two"));
  });

  it("works as a json field in a story", async () => {
    render(<AsJson />);
    await waitFor(() => expect(textbox()).toHaveTextContent("Stored as a document."));
    expect(screen.getByText(/"type": "doc"/)).toBeInTheDocument();
  });

  it("adds the blocks of the app to the slash menu, and runs them", async () => {
    const user = userEvent.setup();
    const ref = createRef<RichTextEditorHandle>();
    render(<YourOwnBlocks ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/shou").run());
    await user.click(await screen.findByRole("option", { name: /Shout/ }));
    expect(ref.current!.getHTML()).toContain("<h2>SHOUT</h2>");
  });

  it("takes new blocks without making a new editor", async () => {
    const ref = createRef<RichTextEditorHandle>();
    const { rerender } = render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    const extra: SlashItem = {
      id: "paragraph",
      title: "Zebra",
      description: "",
      icon: null,
      keywords: [],
      run: () => {},
    };
    rerender(<RichTextEditor ref={ref} slashItems={[extra]} />);
    expect(ref.current!.editor).toBe(editor);
    act(() => void editor.chain().focus().insertContent("/zeb").run());
    expect(await screen.findByRole("option", { name: /Zebra/ })).toBeInTheDocument();
  });

  it("takes the Tiptap extensions of the app", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<YourOwnExtensions ref={ref} />);
    const editor = await ready(ref);
    expect(
      editor.extensionManager.extensions.some((extension) => extension.name === "sparkle"),
    ).toBe(true);
  });

  it("replaces the tools of the toolbar with the ones of the app", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<YourOwnExtensions ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().setTextSelection({ from: 1, to: 6 }).run());
    expect(
      await screen.findByRole("button", { name: "My bold", hidden: true }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Italic", hidden: true })).toBeNull();
  });

  it("can leave out the toolbar and the grip", async () => {
    const { container } = render(<WithoutToolbarsAndGrip />);
    await waitFor(() => expect(textbox()).toHaveTextContent("Just writing."));
    expect(container.querySelector("[data-slot='editor-bubble-menu']")).toBeNull();
    expect(container.querySelector("[data-slot='editor-block-handle']")).toBeNull();
  });

  it("puts the cursor in the editor and hands over the Tiptap editor", async () => {
    const onReady = vi.fn();
    render(<RichTextEditor autofocus="end" defaultValue="<p>Text</p>" onReady={onReady} />);
    await waitFor(() => expect(onReady).toHaveBeenCalledOnce());
    expect(onReady.mock.calls[0]![0].isEditable).toBe(true);
    await waitFor(() => expect(textbox()).toHaveFocus());
  });

  it("takes classes for the writing area", async () => {
    render(<RichTextEditor editorClassName="text-lg" />);
    await waitFor(() => expect(textbox()).toHaveClass("text-lg"));
  });
});
