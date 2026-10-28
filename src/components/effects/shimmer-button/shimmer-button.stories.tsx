import type { Meta, StoryObj } from "@storybook/react-vite";
import ShimmerButtonDemoExample from "./examples/shimmer-button-demo";
import shimmerButtonDemoExampleSource from "./examples/shimmer-button-demo.tsx?raw";

import { ShimmerButton } from "./shimmer-button";

const meta = {
  title: "Effects/Buttons/ShimmerButton",
  component: ShimmerButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ShimmerButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Shimmer button" },
};

export const Default: StoryObj = {
  render: () => <ShimmerButtonDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: shimmerButtonDemoExampleSource, language: "tsx" } },
  },
};
