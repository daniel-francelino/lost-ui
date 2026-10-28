import type { Meta, StoryObj } from "@storybook/react-vite";
import RippleButtonDemoExample from "./examples/ripple-button-demo";
import rippleButtonDemoExampleSource from "./examples/ripple-button-demo.tsx?raw";

import { RippleButton } from "./ripple-button";

const meta = {
  title: "Effects/Buttons/RippleButton",
  component: RippleButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof RippleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Click me" },
};

export const Default: StoryObj = {
  render: () => <RippleButtonDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: rippleButtonDemoExampleSource, language: "tsx" } },
  },
};
