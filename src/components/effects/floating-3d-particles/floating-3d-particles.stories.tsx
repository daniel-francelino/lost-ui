import type { Meta, StoryObj } from "@storybook/react-vite";
import Floating3dParticlesDemoExample from "./examples/floating-3d-particles-demo";
import floating3dParticlesDemoExampleSource from "./examples/floating-3d-particles-demo.tsx?raw";
import Floating3dParticlesDemo2Example from "./examples/floating-3d-particles-demo-2";
import floating3dParticlesDemo2ExampleSource from "./examples/floating-3d-particles-demo-2.tsx?raw";

import { Floating3DParticles } from "./floating-3d-particles";

const meta = {
  title: "Effects/Backgrounds/Floating3DParticles",
  component: Floating3DParticles,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof Floating3DParticles>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { quantity: 60 },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <Floating3DParticles {...args} />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <Floating3dParticlesDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: floating3dParticlesDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <Floating3dParticlesDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: floating3dParticlesDemo2ExampleSource, language: "tsx" } },
  },
};
