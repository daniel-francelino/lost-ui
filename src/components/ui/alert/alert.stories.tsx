import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, AlertTitle, AlertDescription } from "./alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: "w-96" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>You can add components to your app.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive", className: "w-96" },
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired.</AlertDescription>
    </Alert>
  ),
};
