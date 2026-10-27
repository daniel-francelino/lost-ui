import type { Meta, StoryObj } from "@storybook/react-vite";

import { HexagonPattern } from "./hexagon-pattern";

const meta = {
  title: "Effects/Backgrounds/HexagonPattern",
  component: HexagonPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof HexagonPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    radius: 30,
    gap: 4,
    hexagons: [
      [2, 1],
      [3, 2],
    ],
  },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <HexagonPattern
        {...args}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  ),
};
