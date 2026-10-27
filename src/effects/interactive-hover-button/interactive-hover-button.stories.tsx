import type { Meta, StoryObj } from "@storybook/react-vite";
import InteractiveHoverButtonDemoExample from "./examples/interactive-hover-button-demo";
import interactiveHoverButtonDemoExampleSource from "./examples/interactive-hover-button-demo.tsx?raw";

import { InteractiveHoverButton } from "./interactive-hover-button";

const meta = {
  title: "Effects/Buttons/InteractiveHoverButton",
  component: InteractiveHoverButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof InteractiveHoverButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Hover me" },
};

export const Default: StoryObj = {
  render: () => <InteractiveHoverButtonDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: interactiveHoverButtonDemoExampleSource, language: "tsx" } },
  },
};
