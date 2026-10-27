import type { Meta, StoryObj } from "@storybook/react-vite";
import AuroraTextDemoExample from "./examples/aurora-text-demo";
import auroraTextDemoExampleSource from "./examples/aurora-text-demo.tsx?raw";

import { AuroraText } from "./aurora-text";

const meta = {
  title: "Effects/Text/AuroraText",
  component: AuroraText,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof AuroraText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Aurora" },
  render: (args) => (
    <h1 className="text-4xl font-bold tracking-tight">
      Build with <AuroraText {...args} />
    </h1>
  ),
};

export const Faster: Story = {
  args: { children: "Aurora", speed: 3 },
  render: (args) => (
    <h1 className="text-4xl font-bold tracking-tight">
      Build with <AuroraText {...args} />
    </h1>
  ),
};

export const Default: StoryObj = {
  render: () => <AuroraTextDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: auroraTextDemoExampleSource, language: "tsx" } },
  },
};
