import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { RichTextEditor, type RichTextEditorHandle } from "./rich-text-editor";

const textbox = () => screen.getByRole("textbox", { name: "Rich text editor" });

async function ready(handle: { current: RichTextEditorHandle | null }) {
  await waitFor(() => expect(handle.current?.editor).toBeTruthy());
  return handle.current!.editor!;
}

const png = (name = "a.png") => new File(["x"], name, { type: "image/png" });
const pdf = (name = "plan.pdf") => new File(["x"], name, { type: "application/pdf" });

const imageInput = (container: HTMLElement) =>
  container.querySelector("[data-slot='rich-text-editor-image-input']")!;
const fileInput = (container: HTMLElement) =>
  container.querySelector("[data-slot='rich-text-editor-file-input']")!;

const imagesOf = (handle: { current: RichTextEditorHandle | null }) =>
  (handle.current!.getJSON().content ?? []).filter((node) => node.type === "image");

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

const pasteOf = (files: File[], text = "") => ({
  clipboardData: {
    files,
    types: text ? ["Files", "text/plain"] : ["Files"],
    getData: (type: string) => (type === "text/plain" ? text : ""),
  },
});

describe("RichTextEditor, a closed set of nodes and marks", () => {
  const closed = { nodes: ["heading", "bulletList", "image"], marks: ["bold", "italic"] } as const;
  const toolsOutsideTheSet = [
    "Underline",
    "Strikethrough",
    "Code",
    "Highlight",
    "Link",
    "Text colour",
  ];

  it("has in its schema only what is allowed", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} allow={closed} />);
    const { nodes, marks } = (await ready(ref)).schema;
    for (const name of ["paragraph", "heading", "bulletList", "listItem", "image"])
      expect(nodes).toHaveProperty(name);
    for (const name of [
      "blockquote",
      "codeBlock",
      "horizontalRule",
      "orderedList",
      "taskList",
      "table",
      "callout",
      "toggle",
      "file",
    ])
      expect(nodes).not.toHaveProperty(name);
    expect(Object.keys(marks)).toEqual(expect.arrayContaining(["bold", "italic"]));
    for (const name of ["underline", "strike", "code", "link", "highlight", "textStyle"])
      expect(marks).not.toHaveProperty(name);
  });

  it("drops pasted HTML that is outside the set and keeps the rest", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} allow={closed} />);
    const editor = await ready(ref);
    act(() => {
      editor.commands.setContent(
        '<h2>Title</h2><blockquote><p>quote</p></blockquote><hr><p><u>under</u> <em>it</em> <a href="https://a.test">link</a></p>',
      );
    });
    const json = JSON.stringify(ref.current!.getJSON());
    expect(json).toContain('"heading"');
    expect(json).toContain('"italic"');
    for (const gone of ["blockquote", "horizontalRule", "underline", '"link"'])
      expect(json).not.toContain(gone);
    // the text of an unknown block stays
    expect(json).toContain("quote");
  });

  it("offers in the slash menu only the blocks that are allowed", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} allow={{ nodes: ["heading"] }} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/").run());
    await screen.findByRole("listbox");
    // text and the three headings
    expect(screen.getAllByRole("option")).toHaveLength(4);
    expect(screen.queryByRole("option", { name: /Quote/ })).toBeNull();
  });

  it("leaves in the toolbar only the tools whose marks are allowed", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} allow={closed} defaultValue="<p>Hello world</p>" />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().setTextSelection({ from: 1, to: 6 }).run());
    expect(await screen.findByRole("button", { name: "Bold", hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic", hidden: true })).toBeInTheDocument();
    for (const name of toolsOutsideTheSet)
      expect(screen.queryByRole("button", { name, hidden: true })).toBeNull();
  });

  it("keeps the nodes and marks of the app's own extensions", async () => {
    const { Mark } = await import("@tiptap/core");
    const note = Mark.create({ name: "note", parseHTML: () => [{ tag: "span.note" }] });
    const extensions = [note];
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} allow={{ marks: ["bold"] }} extensions={extensions} />);
    expect(await ready(ref)).toHaveProperty("schema.marks.note");
  });
});

describe("RichTextEditor, the tools of the selection toolbar", () => {
  it("shows only the tools it is told to", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(
      <RichTextEditor
        ref={ref}
        bubbleMenu={{ tools: ["bold", "italic"] }}
        defaultValue="<p>Hello world</p>"
      />,
    );
    const editor = await ready(ref);
    act(() => void editor.chain().focus().setTextSelection({ from: 1, to: 6 }).run());
    expect(await screen.findByRole("button", { name: "Bold", hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic", hidden: true })).toBeInTheDocument();
    for (const name of ["Underline", "Strikethrough", "Code", "Highlight", "Link", "Text colour"])
      expect(screen.queryByRole("button", { name, hidden: true })).toBeNull();
  });
});

describe("RichTextEditor, images that point to a stored file", () => {
  it("keeps the attributes an upload gives, in the JSON and in the HTML", async () => {
    const ref = createRef<RichTextEditorHandle>();
    const { container } = render(
      <RichTextEditor
        ref={ref}
        referenceAttributes={["mediaVersionId"]}
        onUploadImage={async () => ({ src: "media/1", attrs: { mediaVersionId: "mv-1" } })}
      />,
    );
    await ready(ref);
    fireEvent.change(imageInput(container), { target: { files: [png()] } });
    await waitFor(() => expect(imagesOf(ref)).toHaveLength(1));
    expect(imagesOf(ref)[0]!.attrs).toMatchObject({ src: "media/1", mediaVersionId: "mv-1" });
    expect(ref.current!.getHTML()).toContain('data-media-version-id="mv-1"');
  });

  it("reads the attributes back from the HTML", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(
      <RichTextEditor
        ref={ref}
        referenceAttributes={["mediaVersionId"]}
        defaultValue='<img src="media/1" data-media-version-id="mv-1">'
      />,
    );
    await ready(ref);
    await waitFor(() => expect(imagesOf(ref)[0]?.attrs).toMatchObject({ mediaVersionId: "mv-1" }));
  });

  it("shows the address the resolver gives and keeps the stored one", async () => {
    const resolveImageSrc = vi.fn(
      async (attrs: { mediaVersionId?: unknown }) =>
        `https://cdn.test/${String(attrs.mediaVersionId)}`,
    );
    const ref = createRef<RichTextEditorHandle>();
    render(
      <RichTextEditor<"json">
        ref={ref}
        format="json"
        referenceAttributes={["mediaVersionId"]}
        resolveImageSrc={resolveImageSrc}
        defaultValue={{
          type: "doc",
          content: [{ type: "image", attrs: { src: "media/1", mediaVersionId: "mv-1" } }],
        }}
      />,
    );
    await ready(ref);
    await waitFor(() =>
      expect(textbox().querySelector("img")).toHaveAttribute("src", "https://cdn.test/mv-1"),
    );
    expect(imagesOf(ref)[0]!.attrs).toMatchObject({ src: "media/1" });
  });

  it("asks the resolver again when the window gets the focus", async () => {
    let n = 0;
    const resolveImageSrc = vi.fn(async () => `https://cdn.test/${(n += 1)}`);
    render(
      <RichTextEditor<"json">
        format="json"
        resolveImageSrc={resolveImageSrc}
        defaultValue={{ type: "doc", content: [{ type: "image", attrs: { src: "media/1" } }] }}
      />,
    );
    await waitFor(() =>
      expect(textbox().querySelector("img")).toHaveAttribute("src", "https://cdn.test/1"),
    );
    act(() => void window.dispatchEvent(new Event("focus")));
    await waitFor(() =>
      expect(textbox().querySelector("img")).toHaveAttribute("src", "https://cdn.test/2"),
    );
  });

  it("shows a placeholder when the resolver fails", async () => {
    render(
      <RichTextEditor<"json">
        format="json"
        resolveImageSrc={() => Promise.reject(new Error("no"))}
        defaultValue={{
          type: "doc",
          content: [{ type: "image", attrs: { src: "media/1", alt: "Cake" } }],
        }}
      />,
    );
    expect(await screen.findByRole("img", { name: "Cake" })).not.toHaveAttribute("src");
  });
});

describe("RichTextEditor, uploading images and files", () => {
  it("uploads several images in a row, in order", async () => {
    const onUploadImage = vi.fn(async (file: File) => `https://img.test/${file.name}`);
    const ref = createRef<RichTextEditorHandle>();
    const { container } = render(<RichTextEditor ref={ref} onUploadImage={onUploadImage} />);
    await ready(ref);
    fireEvent.change(imageInput(container), {
      target: { files: [png("1.png"), png("2.png"), png("3.png")] },
    });
    await waitFor(() => expect(imagesOf(ref)).toHaveLength(3));
    expect(imagesOf(ref).map((node) => node.attrs!.src)).toEqual([
      "https://img.test/1.png",
      "https://img.test/2.png",
      "https://img.test/3.png",
    ]);
  });

  it("uploads the images that are pasted", async () => {
    const onUploadImage = vi.fn(async () => "https://img.test/shot.png");
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} onUploadImage={onUploadImage} />);
    await ready(ref);
    fireEvent.paste(textbox(), pasteOf([png("shot.png")]));
    await waitFor(() => expect(imagesOf(ref)).toHaveLength(1));
    expect(onUploadImage).toHaveBeenCalledOnce();
  });

  it("leaves a paste alone when text comes with the files", async () => {
    const onUploadImage = vi.fn(async () => "https://img.test/shot.png");
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} onUploadImage={onUploadImage} />);
    await ready(ref);
    fireEvent.paste(textbox(), pasteOf([png("sheet.png")], "a\tb"));
    expect(onUploadImage).not.toHaveBeenCalled();
  });

  it("does nothing with pasted images when the app cannot upload", async () => {
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} />);
    await ready(ref);
    fireEvent.paste(textbox(), pasteOf([png()]));
    expect(imagesOf(ref)).toHaveLength(0);
  });

  it("uploads the images that are dropped", async () => {
    const onUploadImage = vi.fn(async () => "https://img.test/drop.png");
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} onUploadImage={onUploadImage} defaultValue="<p>Text</p>" />);
    const editor = await ready(ref);
    // jsdom has no layout: say where the drop is
    editor.view.posAtCoords = () => ({ pos: 1, inside: -1 });
    fireEvent.drop(textbox(), {
      dataTransfer: { files: [png("drop.png")], types: ["Files"], getData: () => "" },
    });
    await waitFor(() => expect(imagesOf(ref)).toHaveLength(1));
    expect(ref.current!.getJSON().content?.map((node) => node.type)).toEqual([
      "paragraph",
      "image",
      "paragraph",
    ]);
  });

  it("shows a placeholder while the file is uploading, and takes it away when it is in", async () => {
    const upload = deferred<string>();
    const ref = createRef<RichTextEditorHandle>();
    const { container } = render(<RichTextEditor ref={ref} onUploadImage={() => upload.promise} />);
    await ready(ref);
    fireEvent.change(imageInput(container), { target: { files: [png("big.png")] } });
    const placeholder = await screen.findByRole("status");
    expect(placeholder).toHaveTextContent("Uploading big.png…");
    expect(placeholder).toHaveAttribute("data-status", "pending");
    // the placeholder is not part of the content
    expect(ref.current!.getHTML()).not.toContain("big.png");
    upload.resolve("https://img.test/big.png");
    await waitFor(() => expect(imagesOf(ref)).toHaveLength(1));
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("keeps a failed upload as a placeholder that can be dismissed", async () => {
    const user = userEvent.setup();
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
    const file = png("bad.png");
    fireEvent.change(imageInput(container), { target: { files: [file] } });
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Could not upload bad.png");
    expect(onUploadError).toHaveBeenCalledWith(failure, file);
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("does not upload more images than the limit and says so", async () => {
    const onUploadImage = vi.fn(async (file: File) => `https://img.test/${file.name}`);
    const onMaxImages = vi.fn();
    const ref = createRef<RichTextEditorHandle>();
    const { container } = render(
      <RichTextEditor
        ref={ref}
        onUploadImage={onUploadImage}
        maxImages={2}
        onMaxImages={onMaxImages}
      />,
    );
    await ready(ref);
    fireEvent.change(imageInput(container), {
      target: { files: [png("1.png"), png("2.png"), png("3.png")] },
    });
    await waitFor(() => expect(imagesOf(ref)).toHaveLength(2));
    expect(onUploadImage).toHaveBeenCalledTimes(2);
    expect(onMaxImages).toHaveBeenCalledWith(2);

    // the text is full now
    fireEvent.change(imageInput(container), { target: { files: [png("4.png")] } });
    expect(onUploadImage).toHaveBeenCalledTimes(2);
    expect(onMaxImages).toHaveBeenCalledTimes(2);
  });

  it("counts the images that are already in the text", async () => {
    const onUploadImage = vi.fn(async () => "https://img.test/x.png");
    const onMaxImages = vi.fn();
    const { container } = render(
      <RichTextEditor
        onUploadImage={onUploadImage}
        maxImages={1}
        onMaxImages={onMaxImages}
        defaultValue='<img src="https://img.test/old.png">'
      />,
    );
    await waitFor(() => expect(textbox().querySelector("img")).toBeInTheDocument());
    fireEvent.change(imageInput(container), { target: { files: [png()] } });
    expect(onMaxImages).toHaveBeenCalledWith(1);
    expect(onUploadImage).not.toHaveBeenCalled();
  });

  it("offers the file block when it can upload files, and puts the picked file in the text", async () => {
    const onUploadFile = vi.fn(async () => ({
      src: "media/9",
      attrs: { mediaVersionId: "mv-9" },
    }));
    const ref = createRef<RichTextEditorHandle>();
    const { container } = render(
      <RichTextEditor
        ref={ref}
        onUploadFile={onUploadFile}
        referenceAttributes={["mediaVersionId"]}
      />,
    );
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/fil").run());
    expect(await screen.findByRole("option", { name: /File/ })).toBeInTheDocument();

    fireEvent.change(fileInput(container), { target: { files: [pdf()] } });
    await waitFor(() =>
      expect(ref.current!.getJSON().content?.some((node) => node.type === "file")).toBe(true),
    );
    const node = ref.current!.getJSON().content!.find((n) => n.type === "file")!;
    expect(node.attrs).toMatchObject({
      src: "media/9",
      name: "plan.pdf",
      mimeType: "application/pdf",
      size: 1,
      mediaVersionId: "mv-9",
    });
    expect(ref.current!.getHTML()).toContain('data-type="file"');
    expect(ref.current!.getHTML()).toContain('data-media-version-id="mv-9"');
    expect(textbox()).toHaveTextContent("plan.pdf");
  });

  it("has no file block without onUploadFile", async () => {
    const ref = createRef<RichTextEditorHandle>();
    const { container } = render(<RichTextEditor ref={ref} />);
    const editor = await ready(ref);
    act(() => void editor.chain().focus().insertContent("/fil").run());
    expect(await screen.findByText("No blocks found")).toBeInTheDocument();
    expect(fileInput(container)).toBeNull();
  });

  it("links the file to the address the resolver gives", async () => {
    render(
      <RichTextEditor<"json">
        format="json"
        resolveFileHref={async (attrs) => `https://cdn.test/${attrs.src}`}
        defaultValue={{
          type: "doc",
          content: [{ type: "file", attrs: { src: "media/9", name: "plan.pdf", size: 2048 } }],
        }}
      />,
    );
    const link = await screen.findByRole("link", { name: "Open plan.pdf" });
    expect(link).toHaveAttribute("href", "https://cdn.test/media/9");
    expect(textbox()).toHaveTextContent("2 KB");
  });

  it("uploads a dropped document as a file and an image as an image", async () => {
    const onUploadFile = vi.fn(async () => "media/doc");
    const onUploadImage = vi.fn(async () => "media/img");
    const ref = createRef<RichTextEditorHandle>();
    render(<RichTextEditor ref={ref} onUploadFile={onUploadFile} onUploadImage={onUploadImage} />);
    const editor = await ready(ref);
    editor.view.posAtCoords = () => ({ pos: 0, inside: -1 });
    fireEvent.drop(textbox(), {
      dataTransfer: { files: [pdf(), png()], types: ["Files"], getData: () => "" },
    });
    await waitFor(() =>
      expect(ref.current!.getJSON().content?.map((node) => node.type)).toEqual(
        expect.arrayContaining(["file", "image"]),
      ),
    );
    expect(onUploadFile).toHaveBeenCalledOnce();
    expect(onUploadImage).toHaveBeenCalledOnce();
  });
});
