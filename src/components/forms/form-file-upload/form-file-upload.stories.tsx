import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormFileUpload } from "./form-file-upload";

const meta = {
  title: "Forms/FormFileUpload",
  component: FormFileUpload,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { className: "w-96", onValueChange: fn(), onReject: fn() },
} satisfies Meta<typeof FormFileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { label: "Avatar", description: "PNG or JPG.", accept: "image/png,image/jpeg" },
};

export const Multiple: Story = { args: { label: "Attachments", multiple: true } };

export const LimitedSize: Story = {
  args: { label: "Document", accept: ".pdf", maxSize: 1024 * 1024, help: "PDF up to 1 MB." },
};

export const CustomText: Story = {
  args: { label: "Resume", dropzoneText: "Drag your resume here" },
};

export const Required: Story = {
  args: { label: "Avatar", required: true, rules: [rules.required("Upload a file")] },
};

export const Disabled: Story = { args: { label: "Avatar", disabled: true } };
