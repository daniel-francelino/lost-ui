import type { Meta, StoryObj } from "@storybook/react-vite";

import { StripedPattern } from "./striped-pattern";

const meta = {
  title: "Effects/Backgrounds/StripedPattern",
  component: StripedPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof StripedPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { direction: "left" },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <StripedPattern
        {...args}
        className="text-muted-foreground [mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  ),
};
