import type { Meta, StoryObj } from "@storybook/react-vite";
import KineticTextDemoExample from "./examples/kinetic-text-demo";
import kineticTextDemoExampleSource from "./examples/kinetic-text-demo.tsx?raw";

import { KineticText } from "./kinetic-text";

const meta = {
  title: "Effects/Text/KineticText",
  component: KineticText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof KineticText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { text: "Kinetic", className: "text-6xl font-bold" },
};

export const Default: StoryObj = {
  render: () => <KineticTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: kineticTextDemoExampleSource, language: "tsx" } },
  },
};
