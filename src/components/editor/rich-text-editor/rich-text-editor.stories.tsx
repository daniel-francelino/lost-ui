import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { fn } from "storybook/test";

import { RichTextEditor } from "./rich-text-editor";

const article = `
<h1>Launch plan</h1>
<p>Everything we need for the <strong>opening week</strong>, in one page. Select a word to format it, or type <code>/</code> for blocks.</p>
<h2>Channels</h2>
<ul><li><p>Instagram: teaser posts</p></li><li><p>LinkedIn: founder story</p></li><li><p>Newsletter: opening offer</p></li></ul>
<h2>Checklist</h2>
<ul data-type="taskList">
  <li data-type="taskItem" data-checked="true"><label><input type="checkbox" checked><span></span></label><div><p>Book the photographer</p></div></li>
  <li data-type="taskItem" data-checked="false"><label><input type="checkbox"><span></span></label><div><p>Approve the captions</p></div></li>
</ul>
<div data-type="callout" data-emoji="💡"><p>Post at 8am on weekdays: that is when the bakery audience is online.</p></div>
<blockquote><p>“Something warm is coming out of the oven.”</p></blockquote>
<table><tbody>
  <tr><th><p>Channel</p></th><th><p>Posts</p></th></tr>
  <tr><td><p>Instagram</p></td><td><p>5</p></td></tr>
</tbody></table>
<div data-type="toggle" data-open="true"><p>Notes for the team</p><p>Keep the tone warm and short.</p></div>
`;

const meta = {
  title: "Editor/RichTextEditor",
  component: RichTextEditor,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { onValueChange: fn() },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RichTextEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { minHeight: "12rem" } };

export const WithContent: Story = { args: { defaultValue: article } };

export const Plain: Story = { args: { defaultValue: article, surface: "plain" } };

export const ReadOnly: Story = { args: { defaultValue: article, editable: false } };

export const WithImageUpload: Story = {
  args: {
    onUploadImage: async (file) => URL.createObjectURL(file),
    onUploadError: fn(),
  },
};

export const SomeBlocks: Story = {
  args: { blocks: ["paragraph", "heading1", "heading2", "bulletList", "taskList"] },
};

export const Controlled: Story = {
  render: (args) => {
    const [html, setHtml] = useState("<p>Edit me, the HTML is below.</p>");
    return (
      <div className="grid gap-3">
        <RichTextEditor {...args} value={html} onValueChange={setHtml} />
        <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{html}</pre>
      </div>
    );
  },
};
