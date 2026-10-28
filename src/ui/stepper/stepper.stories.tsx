import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCardIcon, MapPinIcon, PackageIcon } from "lucide-react";
import { useRef } from "react";

import { Button } from "../button";
import { Stepper, type StepperHandle, type StepperItem } from "./stepper";

const items: StepperItem[] = [
  {
    title: "Address",
    description: "Where to send it",
    icon: <MapPinIcon />,
    content: <p className="text-sm">Fill in the delivery address.</p>,
  },
  {
    title: "Payment",
    description: "How you pay",
    icon: <CreditCardIcon />,
    content: <p className="text-sm">Choose a payment method.</p>,
  },
  {
    title: "Review",
    description: "Check and confirm",
    icon: <PackageIcon />,
    content: <p className="text-sm">Everything looks good?</p>,
  },
];

const meta = {
  title: "UI/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { items, className: "w-full max-w-2xl", "aria-label": "Checkout" },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const DefaultValue: Story = { args: { defaultValue: 1 } };

export const Vertical: Story = { args: { orientation: "vertical", defaultValue: 1 } };

export const NotLinear: Story = { args: { linear: false } };

export const Colors: Story = {
  render: (args) => (
    <div className="grid gap-6">
      {(["primary", "success", "info", "warning", "destructive", "neutral"] as const).map(
        (color) => (
          <Stepper key={color} {...args} color={color} defaultValue={1} />
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Stepper key={size} {...args} size={size} defaultValue={1} />
      ))}
    </div>
  ),
};

export const DisabledStep: Story = {
  args: {
    linear: false,
    items: items.map((item, index) => (index === 2 ? { ...item, disabled: true } : item)),
  },
};

export const WithControls: Story = {
  args: { disabled: true },
  render: (args) => {
    const stepper = useRef<StepperHandle>(null);

    return (
      <div className="grid gap-4">
        <Stepper {...args} ref={stepper} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => stepper.current?.prev()}>
            Back
          </Button>
          <Button onClick={() => stepper.current?.next()}>Next</Button>
        </div>
      </div>
    );
  },
};

export const CustomContent: Story = {
  args: {
    items: items.map((item) => ({ ...item, content: undefined })),
    renderContent: (item) => <p className="rounded-md border p-4 text-sm">Panel of {item.title}</p>,
  },
};
