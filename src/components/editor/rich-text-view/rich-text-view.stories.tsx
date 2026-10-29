import type { Meta, StoryObj } from "@storybook/react-vite";
import type { JSONContent } from "@tiptap/core";

import { RichTextView } from "./rich-text-view";

const plan: JSONContent = {
  type: "doc",
  content: [
    { type: "heading", attrs: { level: 1 }, content: [{ type: "text", text: "Launch plan" }] },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Everything for the " },
        { type: "text", text: "opening week", marks: [{ type: "bold" }] },
        { type: "text", text: ", with a " },
        {
          type: "text",
          text: "link",
          marks: [{ type: "link", attrs: { href: "https://example.com" } }],
        },
        { type: "text", text: "." },
      ],
    },
    {
      type: "bulletList",
      content: [
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Teaser posts" }] }],
        },
        {
          type: "listItem",
          content: [{ type: "paragraph", content: [{ type: "text", text: "Founder story" }] }],
        },
      ],
    },
    { type: "image", attrs: { src: "media/42", alt: "Cake", mediaVersionId: "mv-42" } },
    { type: "file", attrs: { src: "media/7", name: "brief.pdf", size: 183_000 } },
  ],
};

const meta = {
  title: "Editor/RichTextView",
  component: RichTextView,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    value: plan,
    // the document stores ids: the app turns them into addresses it can show
    resolveImageSrc: async () => "https://picsum.photos/seed/lost-ui/640/280",
    resolveFileHref: async () => "https://example.com/brief.pdf",
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichTextView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithoutResolvers: Story = {
  args: { resolveImageSrc: undefined, resolveFileHref: undefined },
};
