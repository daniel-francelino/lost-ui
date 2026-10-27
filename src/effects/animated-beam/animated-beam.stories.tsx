import type { Meta, StoryObj } from "@storybook/react-vite";
import AnimatedBeamBidirectionalExample from "./examples/animated-beam-bidirectional";
import animatedBeamBidirectionalExampleSource from "./examples/animated-beam-bidirectional.tsx?raw";
import AnimatedBeamDemoExample from "./examples/animated-beam-demo";
import animatedBeamDemoExampleSource from "./examples/animated-beam-demo.tsx?raw";
import AnimatedBeamMultipleInputsExample from "./examples/animated-beam-multiple-inputs";
import animatedBeamMultipleInputsExampleSource from "./examples/animated-beam-multiple-inputs.tsx?raw";
import AnimatedBeamMultipleOutputsExample from "./examples/animated-beam-multiple-outputs";
import animatedBeamMultipleOutputsExampleSource from "./examples/animated-beam-multiple-outputs.tsx?raw";
import AnimatedBeamUnidirectionalExample from "./examples/animated-beam-unidirectional";
import animatedBeamUnidirectionalExampleSource from "./examples/animated-beam-unidirectional.tsx?raw";
import { useRef } from "react";

import { AnimatedBeam } from "./animated-beam";

function Node({
  nodeRef,
  label,
}: {
  nodeRef: React.RefObject<HTMLDivElement | null>;
  label: string;
}) {
  return (
    <div
      ref={nodeRef}
      className="z-10 flex size-12 items-center justify-center rounded-full border bg-background text-xs"
    >
      {label}
    </div>
  );
}

function BeamDemo(props: React.ComponentProps<typeof AnimatedBeam>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef} className="relative flex h-40 w-96 items-center justify-between px-8">
      <Node nodeRef={fromRef} label="A" />
      <Node nodeRef={toRef} label="B" />
      <AnimatedBeam {...props} containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
    </div>
  );
}

const meta = {
  title: "Effects/Media/AnimatedBeam",
  component: AnimatedBeam,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof AnimatedBeam>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { containerRef: { current: null }, fromRef: { current: null }, toRef: { current: null } },
  render: (args) => <BeamDemo {...args} />,
};

export const Bidirectional: StoryObj = {
  render: () => <AnimatedBeamBidirectionalExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedBeamBidirectionalExampleSource, language: "tsx" } },
  },
};

export const Default: StoryObj = {
  render: () => <AnimatedBeamDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedBeamDemoExampleSource, language: "tsx" } },
  },
};

export const MultipleInputs: StoryObj = {
  render: () => <AnimatedBeamMultipleInputsExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedBeamMultipleInputsExampleSource, language: "tsx" } },
  },
};

export const MultipleOutputs: StoryObj = {
  render: () => <AnimatedBeamMultipleOutputsExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedBeamMultipleOutputsExampleSource, language: "tsx" } },
  },
};

export const Unidirectional: StoryObj = {
  render: () => <AnimatedBeamUnidirectionalExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: animatedBeamUnidirectionalExampleSource, language: "tsx" } },
  },
};
