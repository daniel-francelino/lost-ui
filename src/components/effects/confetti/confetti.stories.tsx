import type { Meta, StoryObj } from "@storybook/react-vite";
import ConfettiBasicCannonExample from "./examples/confetti-basic-cannon";
import confettiBasicCannonExampleSource from "./examples/confetti-basic-cannon.tsx?raw";
import ConfettiCustomShapesExample from "./examples/confetti-custom-shapes";
import confettiCustomShapesExampleSource from "./examples/confetti-custom-shapes.tsx?raw";
import ConfettiDemoExample from "./examples/confetti-demo";
import confettiDemoExampleSource from "./examples/confetti-demo.tsx?raw";
import ConfettiEmojiExample from "./examples/confetti-emoji";
import confettiEmojiExampleSource from "./examples/confetti-emoji.tsx?raw";
import ConfettiFireworksExample from "./examples/confetti-fireworks";
import confettiFireworksExampleSource from "./examples/confetti-fireworks.tsx?raw";
import ConfettiRandomDirectionExample from "./examples/confetti-random-direction";
import confettiRandomDirectionExampleSource from "./examples/confetti-random-direction.tsx?raw";
import ConfettiSideCannonsExample from "./examples/confetti-side-cannons";
import confettiSideCannonsExampleSource from "./examples/confetti-side-cannons.tsx?raw";
import ConfettiStarsExample from "./examples/confetti-stars";
import confettiStarsExampleSource from "./examples/confetti-stars.tsx?raw";

import { ConfettiButton } from "./confetti";

const meta = {
  title: "Effects/Interactive/Confetti",
  component: ConfettiButton,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ConfettiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { children: "Celebrate" },
};

export const BasicCannon: StoryObj = {
  render: () => <ConfettiBasicCannonExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: confettiBasicCannonExampleSource, language: "tsx" } },
  },
};

export const CustomShapes: StoryObj = {
  render: () => <ConfettiCustomShapesExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: confettiCustomShapesExampleSource, language: "tsx" } },
  },
};

export const Default: StoryObj = {
  render: () => <ConfettiDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: confettiDemoExampleSource, language: "tsx" } },
  },
};

export const Emoji: StoryObj = {
  render: () => <ConfettiEmojiExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: confettiEmojiExampleSource, language: "tsx" } },
  },
};

export const Fireworks: StoryObj = {
  render: () => <ConfettiFireworksExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: confettiFireworksExampleSource, language: "tsx" } },
  },
};

export const RandomDirection: StoryObj = {
  render: () => <ConfettiRandomDirectionExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: confettiRandomDirectionExampleSource, language: "tsx" } },
  },
};

export const SideCannons: StoryObj = {
  render: () => <ConfettiSideCannonsExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: confettiSideCannonsExampleSource, language: "tsx" } },
  },
};

export const Stars: StoryObj = {
  render: () => <ConfettiStarsExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: confettiStarsExampleSource, language: "tsx" } },
  },
};
