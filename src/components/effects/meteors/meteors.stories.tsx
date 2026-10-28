import type { Meta, StoryObj } from "@storybook/react-vite";
import MeteorsDemoExample from "./examples/meteors-demo";
import meteorsDemoExampleSource from "./examples/meteors-demo.tsx?raw";

import { Meteors } from "./meteors";

const meta = {
  title: "Effects/Backgrounds/Meteors",
  component: Meteors,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Meteors>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { number: 20 },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <Meteors {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <MeteorsDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: meteorsDemoExampleSource, language: "tsx" } },
  },
};
