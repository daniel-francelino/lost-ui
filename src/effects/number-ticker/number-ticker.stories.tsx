import type { Meta, StoryObj } from "@storybook/react-vite";
import NumberTickerDecimalDemoExample from "./examples/number-ticker-decimal-demo";
import numberTickerDecimalDemoExampleSource from "./examples/number-ticker-decimal-demo.tsx?raw";
import NumberTickerDemoExample from "./examples/number-ticker-demo";
import numberTickerDemoExampleSource from "./examples/number-ticker-demo.tsx?raw";
import NumberTickerDemo2Example from "./examples/number-ticker-demo-2";
import numberTickerDemo2ExampleSource from "./examples/number-ticker-demo-2.tsx?raw";

import { NumberTicker } from "./number-ticker";

const meta = {
  title: "Effects/Text/NumberTicker",
  component: NumberTicker,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof NumberTicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { value: 1000, className: "text-6xl font-semibold" },
};

export const CountingDown: Story = {
  args: { value: 0, startValue: 100, direction: "down", className: "text-6xl font-semibold" },
};

export const Decimal: StoryObj = {
  render: () => <NumberTickerDecimalDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: numberTickerDecimalDemoExampleSource, language: "tsx" } },
  },
};

export const Default: StoryObj = {
  render: () => <NumberTickerDemoExample />,
  parameters: {
    layout: "padded",
    docs: { source: { code: numberTickerDemoExampleSource, language: "tsx" } },
  },
};

export const Example2: StoryObj = {
  render: () => <NumberTickerDemo2Example />,
  parameters: {
    layout: "padded",
    docs: { source: { code: numberTickerDemo2ExampleSource, language: "tsx" } },
  },
};
