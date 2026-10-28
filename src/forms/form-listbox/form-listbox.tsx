import { useRef } from "react";

import { cn } from "../../lib/cn";
import { FormField } from "../form-field";
import { FormOptionList, optionId } from "../form-option-list";
import type { FieldProps } from "../lib/field-props";
import { normalizeItems, type ItemInput } from "../lib/items";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";
import { useListNavigation } from "../lib/use-list-navigation";

export type FormListboxValue = string | string[];

export type FormListboxProps = FieldProps<FormListboxValue> & {
  items: ItemInput[];
  multiple?: boolean;
  emptyText?: string;
  maxHeight?: string;
};

export function FormListbox(props: FormListboxProps) {
  const [fieldProps, { items, multiple = false, emptyText, maxHeight = "14rem" }] = splitFieldProps<
    FormListboxValue,
    FormListboxProps
  >(props);
  const listRef = useRef<HTMLUListElement>(null);
  const field = useField<FormListboxValue>(fieldProps, {
    fallback: multiple ? [] : "",
    focus: () => listRef.current?.focus(),
  });
  const { controlProps, ids } = field;
  const list = normalizeItems(items);
  const selected = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);

  const choose = (index: number) => {
    const item = list[index];
    if (!item || item.disabled || locked) return;

    if (multiple) {
      field.setValue(
        selected.includes(item.value)
          ? selected.filter((value) => value !== item.value)
          : [...selected, item.value],
      );
    } else {
      field.setValue(item.value);
    }
  };

  const navigation = useListNavigation({
    count: list.length,
    isDisabled: (index) => Boolean(list[index]?.disabled),
    onSelect: choose,
    selectOnSpace: true,
  });
  const listId = `${ids.id}-listbox`;

  return (
    <FormField {...field.shellProps}>
      <div
        className={cn(
          "overflow-auto rounded-md border border-input p-1 focus-within:ring-1 focus-within:ring-ring",
          locked && "pointer-events-none opacity-50",
        )}
        style={{ maxHeight }}
      >
        <FormOptionList
          id={listId}
          items={list}
          selected={selected}
          activeIndex={navigation.activeIndex}
          multiple={multiple}
          emptyText={emptyText}
          onActiveChange={navigation.setActiveIndex}
          onSelect={(item) => choose(list.indexOf(item))}
          listProps={{
            ref: listRef,
            tabIndex: locked ? -1 : 0,
            "aria-labelledby": fieldProps.label ? ids.labelId : undefined,
            "aria-invalid": controlProps["aria-invalid"],
            "aria-describedby": controlProps["aria-describedby"],
            "aria-activedescendant":
              navigation.activeIndex >= 0 ? optionId(listId, navigation.activeIndex) : undefined,
            onKeyDown: navigation.onKeyDown,
            onFocus: controlProps.onFocus,
            onBlur: controlProps.onBlur,
          }}
        />
      </div>
      {fieldProps.name &&
        selected.map((value) => (
          <input key={value} type="hidden" name={fieldProps.name} value={value} />
        ))}
    </FormField>
  );
}
