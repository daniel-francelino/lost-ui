import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartTooltipAdvanced } from "./examples/chart-tooltip-advanced";
import chartTooltipAdvancedSource from "./examples/chart-tooltip-advanced.tsx?raw";
import { ChartTooltipDefault } from "./examples/chart-tooltip-default";
import chartTooltipDefaultSource from "./examples/chart-tooltip-default.tsx?raw";
import { ChartTooltipFormatter } from "./examples/chart-tooltip-formatter";
import chartTooltipFormatterSource from "./examples/chart-tooltip-formatter.tsx?raw";
import { ChartTooltipIcons } from "./examples/chart-tooltip-icons";
import chartTooltipIconsSource from "./examples/chart-tooltip-icons.tsx?raw";
import { ChartTooltipIndicatorLine } from "./examples/chart-tooltip-indicator-line";
import chartTooltipIndicatorLineSource from "./examples/chart-tooltip-indicator-line.tsx?raw";
import { ChartTooltipIndicatorNone } from "./examples/chart-tooltip-indicator-none";
import chartTooltipIndicatorNoneSource from "./examples/chart-tooltip-indicator-none.tsx?raw";
import { ChartTooltipLabelCustom } from "./examples/chart-tooltip-label-custom";
import chartTooltipLabelCustomSource from "./examples/chart-tooltip-label-custom.tsx?raw";
import { ChartTooltipLabelFormatter } from "./examples/chart-tooltip-label-formatter";
import chartTooltipLabelFormatterSource from "./examples/chart-tooltip-label-formatter.tsx?raw";
import { ChartTooltipLabelNone } from "./examples/chart-tooltip-label-none";
import chartTooltipLabelNoneSource from "./examples/chart-tooltip-label-none.tsx?raw";

const meta = {
  title: "Charts/Examples/Tooltip",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

export const Advanced: StoryObj = {
  render: () => <ChartTooltipAdvanced />,
  parameters: { docs: { source: { code: chartTooltipAdvancedSource, language: "tsx" } } },
};

export const Default: StoryObj = {
  render: () => <ChartTooltipDefault />,
  parameters: { docs: { source: { code: chartTooltipDefaultSource, language: "tsx" } } },
};

export const Formatter: StoryObj = {
  render: () => <ChartTooltipFormatter />,
  parameters: { docs: { source: { code: chartTooltipFormatterSource, language: "tsx" } } },
};

export const Icons: StoryObj = {
  render: () => <ChartTooltipIcons />,
  parameters: { docs: { source: { code: chartTooltipIconsSource, language: "tsx" } } },
};

export const IndicatorLine: StoryObj = {
  render: () => <ChartTooltipIndicatorLine />,
  parameters: { docs: { source: { code: chartTooltipIndicatorLineSource, language: "tsx" } } },
};

export const IndicatorNone: StoryObj = {
  render: () => <ChartTooltipIndicatorNone />,
  parameters: { docs: { source: { code: chartTooltipIndicatorNoneSource, language: "tsx" } } },
};

export const LabelCustom: StoryObj = {
  render: () => <ChartTooltipLabelCustom />,
  parameters: { docs: { source: { code: chartTooltipLabelCustomSource, language: "tsx" } } },
};

export const LabelFormatter: StoryObj = {
  render: () => <ChartTooltipLabelFormatter />,
  parameters: { docs: { source: { code: chartTooltipLabelFormatterSource, language: "tsx" } } },
};

export const LabelNone: StoryObj = {
  render: () => <ChartTooltipLabelNone />,
  parameters: { docs: { source: { code: chartTooltipLabelNoneSource, language: "tsx" } } },
};
