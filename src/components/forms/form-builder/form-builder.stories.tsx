import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { rules } from "../rules";
import { FormBuilder, type FormBuilderField } from "./form-builder";

const signup: FormBuilderField[] = [
  {
    control: "input",
    name: "name",
    label: "Full name",
    required: true,
    rules: [rules.required("Name is required"), rules.minLength(3)],
  },
  {
    control: "input",
    name: "email",
    label: "Email",
    type: "email",
    required: true,
    rules: [rules.required("Email is required"), rules.email()],
  },
  {
    control: "select",
    name: "country",
    label: "Country",
    placeholder: "Select a country",
    items: [
      { value: "br", label: "Brazil" },
      { value: "pt", label: "Portugal" },
    ],
    rules: [rules.required("Choose a country")],
  },
  { control: "input-number", name: "seats", label: "Seats", min: 1, max: 20 },
  { control: "textarea", name: "bio", label: "Bio", colSpan: "full" },
  { control: "switch", name: "business", label: "This is a business account", colSpan: "full" },
  {
    control: "input",
    name: "company",
    label: "Company",
    colSpan: "full",
    visible: (values) => values.business === true,
    rules: [rules.required("Company is required")],
  },
  {
    control: "checkbox",
    name: "terms",
    label: "I accept the terms",
    colSpan: "full",
    rules: [rules.required("You must accept the terms")],
  },
];

const meta = {
  title: "Forms/FormBuilder",
  component: FormBuilder,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    fields: signup,
    onSubmit: fn(),
    onValuesChange: fn(),
    onReset: fn(),
    className: "w-full max-w-2xl",
  },
} satisfies Meta<typeof FormBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: { columns: 2, submitLabel: "Create account", showReset: true },
};

export const SingleColumn: Story = { args: { columns: 1 } };

export const WithDefaultValues: Story = {
  args: {
    columns: 2,
    defaultValues: { name: "Ada Lovelace", email: "ada@example.com", country: "pt", seats: 3 },
    showReset: true,
  },
};

export const Loading: Story = { args: { columns: 2, loading: true } };

export const AllFieldTypes: Story = {
  args: {
    columns: 2,
    defaultValues: { k: 30 },
    fields: [
      { control: "input", name: "a", label: "Input" },
      { control: "textarea", name: "b", label: "Textarea" },
      { control: "checkbox", name: "c", label: "Checkbox" },
      { control: "switch", name: "d", label: "Switch" },
      {
        control: "checkbox-group",
        name: "e",
        label: "Checkbox group",
        items: ["One", "Two", "Three"],
      },
      { control: "radio-group", name: "f", label: "Radio group", items: ["Small", "Large"] },
      { control: "select", name: "g", label: "Select", items: ["First", "Second"] },
      { control: "select-menu", name: "h", label: "Select menu", items: ["First", "Second"] },
      { control: "input-menu", name: "i", label: "Input menu", items: ["Lisbon", "Porto"] },
      { control: "listbox", name: "j", label: "Listbox", items: ["Alpha", "Beta"] },
      { control: "slider", name: "k", label: "Slider" },
      { control: "pin-input", name: "l", label: "Pin input", length: 4 },
      { control: "input-number", name: "m", label: "Input number" },
      { control: "input-rating", name: "n", label: "Rating" },
      { control: "input-tags", name: "o", label: "Tags" },
      { control: "input-time", name: "p", label: "Time" },
      { control: "input-date", name: "q", label: "Date" },
      { control: "color-picker", name: "r", label: "Color" },
      { control: "file-upload", name: "s", label: "File", colSpan: "full" },
      { control: "input-money", name: "t", label: "Money", currency: "USD", locale: "en-US" },
      { control: "input-phone", name: "u", label: "Phone", defaultCountry: "PT", locale: "en" },
      { control: "country-select", name: "v", label: "Country", locale: "en" },
      { control: "emoji-picker", name: "w", label: "Emoji" },
    ],
  },
};
