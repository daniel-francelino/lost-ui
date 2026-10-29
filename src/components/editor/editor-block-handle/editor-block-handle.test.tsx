import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RichTextEditor } from "../rich-text-editor";
import { EditorBlockHandle } from "./editor-block-handle";

describe("EditorBlockHandle", () => {
  it("draws nothing without an editor", () => {
    const { container } = render(<EditorBlockHandle editor={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("EditorBlockHandle, the blocks it can turn into", () => {
  it("offers only the blocks it is given", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<RichTextEditor allow={{ nodes: ["heading"] }} />);
    await user.click(await screen.findByLabelText("Block menu", {}, { timeout: 5000 }));
    expect(await screen.findByRole("menuitem", { name: "Heading 2" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Text" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "Quote" })).toBeNull();
    expect(screen.queryByRole("menuitem", { name: "Bulleted list" })).toBeNull();
  });

  it("offers all the text blocks when nothing limits it", async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<RichTextEditor />);
    await user.click(await screen.findByLabelText("Block menu", {}, { timeout: 5000 }));
    expect(await screen.findByRole("menuitem", { name: "Quote" })).toBeInTheDocument();
  });
});
