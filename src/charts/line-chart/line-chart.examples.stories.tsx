import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartLineDefault } from "./examples/chart-line-default";
import chartLineDefaultSource from "./examples/chart-line-default.tsx?raw";
import { ChartLineDotsColors } from "./examples/chart-line-dots-colors";
import chartLineDotsColorsSource from "./examples/chart-line-dots-colors.tsx?raw";
import { ChartLineDotsCustom } from "./examples/chart-line-dots-custom";
import chartLineDotsCustomSource from "./examples/chart-line-dots-custom.tsx?raw";
import { ChartLineDots } from "./examples/chart-line-dots";
import chartLineDotsSource from "./examples/chart-line-dots.tsx?raw";
import { ChartLineInteractive } from "./examples/chart-line-interactive";
import chartLineInteractiveSource from "./examples/chart-line-interactive.tsx?raw";
import { ChartLineLabelCustom } from "./examples/chart-line-label-custom";
import chartLineLabelCustomSource from "./examples/chart-line-label-custom.tsx?raw";
import { ChartLineLabel } from "./examples/chart-line-label";
import chartLineLabelSource from "./examples/chart-line-label.tsx?raw";
import { ChartLineLinear } from "./examples/chart-line-linear";
import chartLineLinearSource from "./examples/chart-line-linear.tsx?raw";
import { ChartLineMultiple } from "./examples/chart-line-multiple";
import chartLineMultipleSource from "./examples/chart-line-multiple.tsx?raw";
import { ChartLineStep } from "./examples/chart-line-step";
import chartLineStepSource from "./examples/chart-line-step.tsx?raw";

const meta = {
  title: "Charts/Examples/Line",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

export const Default: StoryObj = {
  render: () => <ChartLineDefault />,
  parameters: { docs: { source: { code: chartLineDefaultSource, language: "tsx" } } },
};

export const DotsColors: StoryObj = {
  render: () => <ChartLineDotsColors />,
  parameters: { docs: { source: { code: chartLineDotsColorsSource, language: "tsx" } } },
};

export const DotsCustom: StoryObj = {
  render: () => <ChartLineDotsCustom />,
  parameters: { docs: { source: { code: chartLineDotsCustomSource, language: "tsx" } } },
};

export const Dots: StoryObj = {
  render: () => <ChartLineDots />,
  parameters: { docs: { source: { code: chartLineDotsSource, language: "tsx" } } },
};

export const Interactive: StoryObj = {
  render: () => <ChartLineInteractive />,
  parameters: { docs: { source: { code: chartLineInteractiveSource, language: "tsx" } } },
};

export const LabelCustom: StoryObj = {
  render: () => <ChartLineLabelCustom />,
  parameters: { docs: { source: { code: chartLineLabelCustomSource, language: "tsx" } } },
};

export const Label: StoryObj = {
  render: () => <ChartLineLabel />,
  parameters: { docs: { source: { code: chartLineLabelSource, language: "tsx" } } },
};

export const Linear: StoryObj = {
  render: () => <ChartLineLinear />,
  parameters: { docs: { source: { code: chartLineLinearSource, language: "tsx" } } },
};

export const Multiple: StoryObj = {
  render: () => <ChartLineMultiple />,
  parameters: { docs: { source: { code: chartLineMultipleSource, language: "tsx" } } },
};

export const Step: StoryObj = {
  render: () => <ChartLineStep />,
  parameters: { docs: { source: { code: chartLineStepSource, language: "tsx" } } },
};
