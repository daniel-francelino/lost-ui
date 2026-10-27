import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlyphMatrix } from "./glyph-matrix";

const meta = {
  title: "Effects/Backgrounds/GlyphMatrix",
  component: GlyphMatrix,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof GlyphMatrix>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <GlyphMatrix {...args} />
    </div>
  ),
};
