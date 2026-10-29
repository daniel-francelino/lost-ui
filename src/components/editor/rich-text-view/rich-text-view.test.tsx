import { composeStories } from "@storybook/react-vite";
import type { JSONContent } from "@tiptap/core";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RichTextView } from "./rich-text-view";
import * as stories from "./rich-text-view.stories";

const { Playground, WithoutResolvers } = composeStories(stories);

const text = (value: string, marks?: JSONContent["marks"]): JSONContent => ({
  type: "text",
  text: value,
  ...(marks ? { marks } : {}),
});
const paragraph = (...content: JSONContent[]): JSONContent => ({ type: "paragraph", content });
const doc = (...content: JSONContent[]): JSONContent => ({ type: "doc", content });

describe("RichTextView", () => {
  it("draws the text, the marks, the lists and the headings", () => {
    const { container } = render(<Playground />);
    expect(screen.getByRole("heading", { level: 1, name: "Launch plan" })).toBeInTheDocument();
    expect(container.querySelector("strong")).toHaveTextContent("opening week");
    expect(screen.getByRole("link", { name: "link" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(container.querySelectorAll("ul > li")).toHaveLength(2);
  });

  it("shows the address the resolver gives for an image and for a file", async () => {
    render(<Playground />);
    // until the address is known there is a placeholder with the same name
    await waitFor(() =>
      expect(screen.getByRole("img", { name: "Cake" })).toHaveAttribute(
        "src",
        "https://picsum.photos/seed/lost-ui/640/280",
      ),
    );
    const link = await screen.findByRole("link", { name: "Open brief.pdf" });
    expect(link).toHaveAttribute("href", "https://example.com/brief.pdf");
    expect(screen.getByText("179 KB")).toBeInTheDocument();
  });

  it("gets the node attributes in the resolver", async () => {
    const resolveImageSrc = vi.fn(async () => "https://cdn.test/x.png");
    render(<Playground resolveImageSrc={resolveImageSrc} />);
    await waitFor(() => expect(resolveImageSrc).toHaveBeenCalled());
    expect(resolveImageSrc).toHaveBeenCalledWith(
      expect.objectContaining({ src: "media/42", mediaVersionId: "mv-42" }),
    );
  });

  it("shows the stored address when there is no resolver", async () => {
    render(<WithoutResolvers />);
    expect(await screen.findByRole("img", { name: "Cake" })).toHaveAttribute("src", "media/42");
  });

  it("is a view: no textbox, nothing to edit", () => {
    const { container } = render(<Playground />);
    expect(screen.queryByRole("textbox")).toBeNull();
    expect(container.querySelector("[contenteditable]")).toBeNull();
    expect(container.querySelector("[data-slot='rich-text-view']")).toBeInTheDocument();
  });

  it("draws nothing for an empty or missing document", () => {
    const { container, rerender } = render(<RichTextView value={null} />);
    expect(container.querySelector("[data-slot='rich-text-view']")).toBeEmptyDOMElement();
    rerender(<RichTextView value={doc()} />);
    expect(container.querySelector("[data-slot='rich-text-view']")).toBeEmptyDOMElement();
  });

  it("drops the links with an address that can run code", () => {
    render(
      <RichTextView
        value={doc(
          paragraph(
            text("bad", [{ type: "link", attrs: { href: "javascript:alert(1)" } }]),
            text(" good", [{ type: "link", attrs: { href: "https://a.test" } }]),
          ),
        )}
      />,
    );
    expect(screen.queryByRole("link", { name: "bad" })).toBeNull();
    expect(screen.getByText("bad")).toBeInTheDocument();
    const good = screen.getByRole("link", { name: "good" });
    expect(good).toHaveAttribute("rel", "noopener noreferrer nofollow");
  });

  it("keeps a colour that is safe and drops one that is not", () => {
    render(
      <RichTextView
        value={doc(
          paragraph(
            text("safe", [{ type: "textStyle", attrs: { color: "var(--primary)" } }]),
            text("unsafe", [{ type: "textStyle", attrs: { color: "red; background: url(x)" } }]),
          ),
        )}
      />,
    );
    expect(screen.getByText("safe").style.color).toBe("var(--primary)");
    expect(screen.getByText("unsafe").getAttribute("style")).toBeNull();
  });

  it("drops a mark it does not know and unwraps a node it does not know", () => {
    const { container } = render(
      <RichTextView
        value={doc(
          paragraph(text("plain", [{ type: "sparkle" }])),
          { type: "sparkleBlock", content: [paragraph(text("inside"))] },
          { type: "mystery" },
        )}
      />,
    );
    expect(screen.getByText("plain")).toBeInTheDocument();
    expect(screen.getByText("inside")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot='rich-text-view'] > *")).toHaveLength(2);
  });

  it("draws the other blocks of the editor", () => {
    const { container } = render(
      <RichTextView
        value={doc(
          { type: "blockquote", content: [paragraph(text("quote"))] },
          { type: "codeBlock", content: [text("const a = 1")] },
          { type: "horizontalRule" },
          {
            type: "orderedList",
            attrs: { start: 3 },
            content: [{ type: "listItem", content: [paragraph(text("three"))] }],
          },
          {
            type: "taskList",
            content: [
              { type: "taskItem", attrs: { checked: true }, content: [paragraph(text("done"))] },
            ],
          },
          {
            type: "callout",
            attrs: { emoji: "🔥" },
            content: [paragraph(text("hot"))],
          },
          {
            type: "toggle",
            attrs: { open: false },
            content: [paragraph(text("title")), paragraph(text("hidden"))],
          },
          {
            type: "table",
            content: [
              {
                type: "tableRow",
                content: [
                  { type: "tableHeader", content: [paragraph(text("H"))] },
                  { type: "tableCell", attrs: { colspan: 2 }, content: [paragraph(text("C"))] },
                ],
              },
            ],
          },
        )}
      />,
    );
    expect(container.querySelector("blockquote")).toHaveTextContent("quote");
    expect(container.querySelector("pre code")).toHaveTextContent("const a = 1");
    expect(container.querySelector("hr")).toBeInTheDocument();
    expect(container.querySelector("ol")).toHaveAttribute("start", "3");
    expect(container.querySelector("ul[data-type='taskList'] input")).toBeChecked();
    expect(container.querySelector("div[data-type='callout']")).toHaveAttribute("data-emoji", "🔥");
    expect(container.querySelector("details[data-type='toggle']")).not.toHaveAttribute("open");
    expect(container.querySelector("summary")).toHaveTextContent("title");
    expect(container.querySelector("th")).toHaveTextContent("H");
    expect(container.querySelector("td")).toHaveAttribute("colspan", "2");
  });

  it("takes classes", () => {
    const { container } = render(<RichTextView value={doc()} className="text-sm" />);
    expect(container.querySelector("[data-slot='rich-text-view']")).toHaveClass("text-sm");
  });
});
