import type { Meta, StoryObj } from "@storybook/react-vite";
import ParticlesDemoExample from "./examples/particles-demo";
import particlesDemoExampleSource from "./examples/particles-demo.tsx?raw";

import { Particles } from "./particles";

const meta = {
  title: "Effects/Backgrounds/Particles",
  component: Particles,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Particles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { quantity: 100, ease: 80, color: "#888888", refresh: true, className: "absolute inset-0" },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <Particles {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <ParticlesDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: particlesDemoExampleSource, language: "tsx" } },
  },
};
