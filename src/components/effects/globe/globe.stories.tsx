import type { Meta, StoryObj } from "@storybook/react-vite";
import GlobeDemoExample from "./examples/globe-demo";
import globeDemoExampleSource from "./examples/globe-demo.tsx?raw";

import { Globe } from "./globe";

const meta = {
  title: "Effects/Media/Globe",
  component: Globe,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Globe>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { className: "size-80" },
  render: (args) => (
    <div className="relative size-80">
      <Globe {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <GlobeDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: globeDemoExampleSource, language: "tsx" } },
  },
};
