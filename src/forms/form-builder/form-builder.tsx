import { useRef, useState, type ComponentType, type ReactNode, type Ref } from "react";
import { LoaderCircleIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import { useLostTranslation } from "../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { FormCheckbox, type FormCheckboxProps } from "../form-checkbox";
import { FormCheckboxGroup, type FormCheckboxGroupProps } from "../form-checkbox-group";
import { FormColorPicker, type FormColorPickerProps } from "../form-color-picker";
import { FormCountrySelect, type FormCountrySelectProps } from "../form-country-select";
import { FormEmojiPicker, type FormEmojiPickerProps } from "../form-emoji-picker";
import { FormFileUpload, type FormFileUploadProps } from "../form-file-upload";
import { FormInput, type FormInputProps } from "../form-input";
import { FormInputDate, type FormInputDateProps } from "../form-input-date";
import { FormInputMenu, type FormInputMenuProps } from "../form-input-menu";
import { FormInputMoney, type FormInputMoneyProps } from "../form-input-money";
import { FormInputNumber, type FormInputNumberProps } from "../form-input-number";
import { FormInputPhone, type FormInputPhoneProps } from "../form-input-phone";
import { FormInputRating, type FormInputRatingProps } from "../form-input-rating";
import { FormInputTags, type FormInputTagsProps } from "../form-input-tags";
import { FormInputTime, type FormInputTimeProps } from "../form-input-time";
import { FormListbox, type FormListboxProps } from "../form-listbox";
import { FormPinInput, type FormPinInputProps } from "../form-pin-input";
import { FormRadioGroup, type FormRadioGroupProps } from "../form-radio-group";
import { FormSelect, type FormSelectProps } from "../form-select";
import { FormSelectMenu, type FormSelectMenuProps } from "../form-select-menu";
import { FormSlider, type FormSliderProps } from "../form-slider";
import { FormSwitch, type FormSwitchProps } from "../form-switch";
import { FormTextarea, type FormTextareaProps } from "../form-textarea";
import { Form, type FormHandle, type FormProps } from "../form";

export type FormValues = Record<string, unknown>;

type FieldPropsMap = {
  input: FormInputProps;
  textarea: FormTextareaProps;
  checkbox: FormCheckboxProps;
  switch: FormSwitchProps;
  "checkbox-group": FormCheckboxGroupProps;
  "radio-group": FormRadioGroupProps;
  select: FormSelectProps;
  "select-menu": FormSelectMenuProps;
  "input-menu": FormInputMenuProps;
  listbox: FormListboxProps;
  slider: FormSliderProps;
  "pin-input": FormPinInputProps;
  "input-number": FormInputNumberProps;
  "input-rating": FormInputRatingProps;
  "input-tags": FormInputTagsProps;
  "input-time": FormInputTimeProps;
  "input-date": FormInputDateProps;
  "color-picker": FormColorPickerProps;
  "file-upload": FormFileUploadProps;
  "input-money": FormInputMoneyProps;
  "input-phone": FormInputPhoneProps;
  "country-select": FormCountrySelectProps;
  "emoji-picker": FormEmojiPickerProps;
};

export type FormBuilderFieldType = keyof FieldPropsMap;

type ControlledKeys = "value" | "defaultValue" | "onValueChange" | "name" | "id";

export type FormBuilderField = {
  [K in FormBuilderFieldType]: {
    control: K;
    name: string;
    colSpan?: 1 | 2 | 3 | 4 | "full";
    visible?: boolean | ((values: FormValues) => boolean);
  } & Omit<FieldPropsMap[K], ControlledKeys>;
}[FormBuilderFieldType];

const components: { [K in FormBuilderFieldType]: ComponentType<FieldPropsMap[K]> } = {
  input: FormInput,
  textarea: FormTextarea,
  checkbox: FormCheckbox,
  switch: FormSwitch,
  "checkbox-group": FormCheckboxGroup,
  "radio-group": FormRadioGroup,
  select: FormSelect,
  "select-menu": FormSelectMenu,
  "input-menu": FormInputMenu,
  listbox: FormListbox,
  slider: FormSlider,
  "pin-input": FormPinInput,
  "input-number": FormInputNumber,
  "input-rating": FormInputRating,
  "input-tags": FormInputTags,
  "input-time": FormInputTime,
  "input-date": FormInputDate,
  "color-picker": FormColorPicker,
  "file-upload": FormFileUpload,
  "input-money": FormInputMoney,
  "input-phone": FormInputPhone,
  "country-select": FormCountrySelect,
  "emoji-picker": FormEmojiPicker,
};

const columnClass = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
} as const;

const spanClass = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
  4: "sm:col-span-2 lg:col-span-4",
  full: "col-span-full",
} as const;

export type FormBuilderProps = Omit<FormProps, "onSubmit" | "onReset" | "ref" | "children"> & {
  fields: FormBuilderField[];
  defaultValues?: FormValues;
  values?: FormValues;
  onValuesChange?: (values: FormValues) => void;
  onSubmit?: (values: FormValues) => void;
  onReset?: () => void;
  columns?: 1 | 2 | 3 | 4;
  submitLabel?: ReactNode;
  resetLabel?: ReactNode;
  showReset?: boolean;
  loading?: boolean;
  actions?: ReactNode;
  formRef?: Ref<FormHandle>;
};

export function FormBuilder({
  fields,
  defaultValues,
  values: controlledValues,
  onValuesChange,
  onSubmit,
  onReset,
  columns = 1,
  submitLabel,
  resetLabel,
  showReset = false,
  loading = false,
  actions,
  formRef,
  className,
  ...formProps
}: FormBuilderProps) {
  const { t } = useLostTranslation();
  const initial = useRef(defaultValues ?? {});
  const [innerValues, setInnerValues] = useState<FormValues>(initial.current);
  const values = controlledValues ?? innerValues;
  const latest = useRef(values);
  latest.current = values;

  const update = (next: FormValues) => {
    if (controlledValues === undefined) setInnerValues(next);
    onValuesChange?.(next);
  };

  return (
    <Form
      {...formProps}
      ref={formRef}
      className={className}
      onSubmit={() => onSubmit?.(latest.current)}
      onReset={() => {
        update(initial.current);
        onReset?.();
      }}
    >
      <div data-slot="form-builder-fields" className={cn("grid gap-4", columnClass[columns])}>
        {fields.map((field) => {
          const { control, name, colSpan = 1, visible = true, ...rest } = field;
          const isVisible = typeof visible === "function" ? visible(values) : visible;
          if (!isVisible) return null;

          const Control = components[control] as ComponentType<Record<string, unknown>>;

          return (
            <div key={name} className={spanClass[colSpan]}>
              <Control
                {...rest}
                name={name}
                value={values[name]}
                onValueChange={(next: unknown) => update({ ...latest.current, [name]: next })}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <LoaderCircleIcon className="animate-spin" aria-hidden="true" />}
          {submitLabel ?? t("form.submit")}
        </Button>
        {showReset && (
          <Button type="reset" variant="outline" disabled={loading}>
            {resetLabel ?? t("form.reset")}
          </Button>
        )}
        {actions}
      </div>
    </Form>
  );
}
