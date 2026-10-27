import type { Meta, StoryObj } from "@storybook/react-vite";
import DotPatternDemoExample from "./examples/dot-pattern-demo";
import dotPatternDemoExampleSource from "./examples/dot-pattern-demo.tsx?raw";
import DotPatternLinearGradientExample from "./examples/dot-pattern-linear-gradient";
import dotPatternLinearGradientExampleSource from "./examples/dot-pattern-linear-gradient.tsx?raw";
import DotPatternWithGlowEffectExample from "./examples/dot-pattern-with-glow-effect";
import dotPatternWithGlowEffectExampleSource from "./examples/dot-pattern-with-glow-effect.tsx?raw";

import { DotPattern } from "./dot-pattern";

const meta = {
  title: "Effects/Backgrounds/DotPattern",
  component: DotPattern,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof DotPattern>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { glow: true },
  render: (args) => (
    <div className="relative flex h-72 w-full max-w-xl items-center justify-center overflow-hidden rounded-lg border bg-background">
      <p className="z-10 text-sm font-medium">Background</p>
      <DotPattern
        {...args}
        className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
      />
    </div>
  ),
};

export const Default: StoryObj = {
  render: () => <DotPatternDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dotPatternDemoExampleSource, language: "tsx" } },
  },
};

export const LinearGradient: StoryObj = {
  render: () => <DotPatternLinearGradientExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dotPatternLinearGradientExampleSource, language: "tsx" } },
  },
};

export const WithGlowEffect: StoryObj = {
  render: () => <DotPatternWithGlowEffectExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: dotPatternWithGlowEffectExampleSource, language: "tsx" } },
  },
};
