import type { Meta, StoryObj } from "@storybook/react-vite";

import { GridPattern } from "./grid-pattern";

const meta = {
  title: "Effects/Backgrounds/GridPattern",
  component: GridPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof GridPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 40,
    height: 40,
    x: -1,
    y: -1,
    squares: [
      [4, 4],
      [5, 1],
      [8, 2],
      [5, 3],
    ],
  },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <GridPattern
        {...args}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  ),
};
