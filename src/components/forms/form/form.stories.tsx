import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Button } from "../../ui/button";
import { FormInput } from "../form-input";
import { FormTextarea } from "../form-textarea";
import { Form } from "./form";

const meta = {
  title: "Forms/Form",
  component: Form,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { onSubmit: fn(), onReset: fn(), className: "grid w-96 gap-4" },
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Form {...args}>
      <FormInput
        name="email"
        label="Email"
        type="email"
        required
        rules={[
          (value) => Boolean(value) || "Email is required",
          (value, test) => test.email(value) || "Enter a valid email",
        ]}
      />
      <FormInput
        name="name"
        label="Name"
        required
        rules={[(value) => value.length >= 3 || "At least 3 characters"]}
      />
      <FormTextarea name="bio" label="Bio" help="Optional" />
      <div className="flex gap-2">
        <Button type="submit">Submit</Button>
        <Button type="reset" variant="outline">
          Reset
        </Button>
      </div>
    </Form>
  ),
};

export const Greedy: Story = {
  args: { greedy: true },
  render: Playground.render,
};

export const NoErrorFocus: Story = {
  args: { noErrorFocus: true },
  render: Playground.render,
};

export const Autofocus: Story = {
  args: { autofocus: true },
  render: Playground.render,
};
