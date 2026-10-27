import type { Meta, StoryObj } from "@storybook/react-vite";

import { FlickeringGrid } from "./flickering-grid";

const meta = {
  title: "Effects/Backgrounds/FlickeringGrid",
  component: FlickeringGrid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof FlickeringGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    squareSize: 4,
    gridGap: 6,
    color: "#6B7280",
    maxOpacity: 0.5,
    flickerChance: 0.1,
    className: "absolute inset-0 size-full",
  },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <FlickeringGrid {...args} />
    </div>
  ),
};
