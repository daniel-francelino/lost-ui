import type { Meta, StoryObj } from "@storybook/react-vite";
import HighlighterDemoExample from "./examples/highlighter-demo";
import highlighterDemoExampleSource from "./examples/highlighter-demo.tsx?raw";

import { Highlighter } from "./highlighter";

const meta = {
  title: "Effects/Text/Highlighter",
  component: Highlighter,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Highlighter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "highlighted", action: "highlight", color: "var(--effect-from)" },
  render: (args) => (
    <p className="text-lg">
      This text is <Highlighter {...args} /> like a marker.
    </p>
  ),
};

export const Underline: Story = {
  args: { children: "underlined", action: "underline", color: "var(--primary)" },
  render: (args) => (
    <p className="text-lg">
      This text is <Highlighter {...args} /> by hand.
    </p>
  ),
};

export const Default: StoryObj = {
  render: () => <HighlighterDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: highlighterDemoExampleSource, language: "tsx" } },
  },
};
