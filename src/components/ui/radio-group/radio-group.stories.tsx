import type { Meta, StoryObj } from "@storybook/react-vite";

import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultValue: "comfortable" },
  render: (args) => (
    <RadioGroup {...args}>
      {["default", "comfortable", "compact"].map((value) => (
        <label key={value} className="flex items-center gap-2 text-sm">
          <RadioGroupItem value={value} aria-label={value} />
          {value}
        </label>
      ))}
    </RadioGroup>
  ),
};
