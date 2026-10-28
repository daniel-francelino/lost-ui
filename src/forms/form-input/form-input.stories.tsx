import type { Meta, StoryObj } from "@storybook/react-vite";
import { MailIcon, SearchIcon } from "lucide-react";
import { fn } from "storybook/test";

import { FormInput } from "./form-input";

const requiredEmail = [
  (value: string) => Boolean(value) || "Email is required",
  (value: string, test: { email: (value: unknown) => boolean }) =>
    test.email(value) || "Enter a valid email",
];

const meta = {
  title: "Forms/FormInput",
  component: FormInput,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-80", onValueChange: fn() },
} satisfies Meta<typeof FormInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Email", placeholder: "you@example.com", type: "email" },
};

export const WithRules: Story = {
  args: { label: "Email", type: "email", required: true, rules: requiredEmail },
};

export const LazyRules: Story = {
  args: {
    label: "Email (validated on blur)",
    type: "email",
    rules: requiredEmail,
    lazyRules: true,
  },
};

export const OnDemand: Story = {
  args: {
    label: "Email (validated by the form)",
    type: "email",
    rules: requiredEmail,
    lazyRules: "ondemand",
  },
};

export const AsyncRule: Story = {
  args: {
    label: "Username",
    help: "Try “taken”",
    rules: [
      async (value: string) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return value !== "taken" || "That username is already used";
      },
    ],
  },
};

export const WithHelpAndHint: Story = {
  args: {
    label: "Password",
    type: "password",
    hint: "Optional",
    description: "Use at least 12 characters.",
    help: "We never share it.",
  },
};

export const WithIcons: Story = {
  args: {
    label: "Search",
    leading: <SearchIcon className="size-4" />,
    trailing: <MailIcon className="size-4" />,
  },
};

export const Loading: Story = { args: { label: "Checking", loading: true, defaultValue: "ada" } };

export const ExternalError: Story = {
  args: {
    label: "Email",
    error: true,
    errorMessage: "This email is blocked",
    defaultValue: "me@x.io",
  },
};

export const Disabled: Story = {
  args: { label: "Locked", disabled: true, defaultValue: "read only" },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid gap-3">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <FormInput key={size} {...args} size={size} label={`Size ${size}`} />
      ))}
    </div>
  ),
};
