import type { Meta, StoryObj } from "@storybook/react-vite";

import { Marquee } from "./marquee";

const meta = {
  title: "Effects/Layout/Marquee",
  component: Marquee,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Marquee>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { pauseOnHover: true, children: null },
  render: (args) => (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee {...args} className="[--duration:20s]">
        {["Design", "Build", "Ship", "Repeat"].map((word) => (
          <span key={word} className="rounded-lg border px-4 py-2">
            {word}
          </span>
        ))}
      </Marquee>
    </div>
  ),
};

export const Vertical: Story = {
  args: { vertical: true, reverse: true, children: null },
  render: (args) => (
    <div className="relative flex h-64 w-48 flex-col items-center justify-center overflow-hidden">
      <Marquee {...args} className="[--duration:20s]">
        {["One", "Two", "Three"].map((word) => (
          <span key={word} className="rounded-lg border px-4 py-2">
            {word}
          </span>
        ))}
      </Marquee>
    </div>
  ),
};
