import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartBarActive } from "./examples/chart-bar-active";
import chartBarActiveSource from "./examples/chart-bar-active.tsx?raw";
import { ChartBarDefault } from "./examples/chart-bar-default";
import chartBarDefaultSource from "./examples/chart-bar-default.tsx?raw";
import { ChartBarHorizontal } from "./examples/chart-bar-horizontal";
import chartBarHorizontalSource from "./examples/chart-bar-horizontal.tsx?raw";
import { ChartBarInteractive } from "./examples/chart-bar-interactive";
import chartBarInteractiveSource from "./examples/chart-bar-interactive.tsx?raw";
import { ChartBarLabelCustom } from "./examples/chart-bar-label-custom";
import chartBarLabelCustomSource from "./examples/chart-bar-label-custom.tsx?raw";
import { ChartBarLabel } from "./examples/chart-bar-label";
import chartBarLabelSource from "./examples/chart-bar-label.tsx?raw";
import { ChartBarMixed } from "./examples/chart-bar-mixed";
import chartBarMixedSource from "./examples/chart-bar-mixed.tsx?raw";
import { ChartBarMultiple } from "./examples/chart-bar-multiple";
import chartBarMultipleSource from "./examples/chart-bar-multiple.tsx?raw";
import { ChartBarNegative } from "./examples/chart-bar-negative";
import chartBarNegativeSource from "./examples/chart-bar-negative.tsx?raw";
import { ChartBarStacked } from "./examples/chart-bar-stacked";
import chartBarStackedSource from "./examples/chart-bar-stacked.tsx?raw";

const meta = {
  title: "Charts/Bar",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

export const Active: StoryObj = {
  render: () => <ChartBarActive />,
  parameters: { docs: { source: { code: chartBarActiveSource, language: "tsx" } } },
};

export const Default: StoryObj = {
  render: () => <ChartBarDefault />,
  parameters: { docs: { source: { code: chartBarDefaultSource, language: "tsx" } } },
};

export const Horizontal: StoryObj = {
  render: () => <ChartBarHorizontal />,
  parameters: { docs: { source: { code: chartBarHorizontalSource, language: "tsx" } } },
};

export const Interactive: StoryObj = {
  render: () => <ChartBarInteractive />,
  parameters: { docs: { source: { code: chartBarInteractiveSource, language: "tsx" } } },
};

export const LabelCustom: StoryObj = {
  render: () => <ChartBarLabelCustom />,
  parameters: { docs: { source: { code: chartBarLabelCustomSource, language: "tsx" } } },
};

export const Label: StoryObj = {
  render: () => <ChartBarLabel />,
  parameters: { docs: { source: { code: chartBarLabelSource, language: "tsx" } } },
};

export const Mixed: StoryObj = {
  render: () => <ChartBarMixed />,
  parameters: { docs: { source: { code: chartBarMixedSource, language: "tsx" } } },
};

export const Multiple: StoryObj = {
  render: () => <ChartBarMultiple />,
  parameters: { docs: { source: { code: chartBarMultipleSource, language: "tsx" } } },
};

export const Negative: StoryObj = {
  render: () => <ChartBarNegative />,
  parameters: { docs: { source: { code: chartBarNegativeSource, language: "tsx" } } },
};

export const Stacked: StoryObj = {
  render: () => <ChartBarStacked />,
  parameters: { docs: { source: { code: chartBarStackedSource, language: "tsx" } } },
};
