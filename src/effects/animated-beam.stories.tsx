import type { Meta, StoryObj } from "@storybook/react-vite";
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

export const Default: Story = {
  args: { containerRef: { current: null }, fromRef: { current: null }, toRef: { current: null } },
  render: (args) => <BeamDemo {...args} />,
};
