import { useRef, useState, type ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Input } from "../../ui/input";
import { FormField } from "../form-field";
import { FormOptionList, optionId } from "../form-option-list";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { itemText, normalizeItems, type ItemInput } from "../lib/items";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";
import { useListNavigation } from "../lib/use-list-navigation";

export type FormInputMenuProps = FieldProps<string> & {
  items: ItemInput[];
  placeholder?: string;
  creatable?: boolean;
  emptyText?: ReactNode;
};

export function FormInputMenu(props: FormInputMenuProps) {
  const { t } = useLostTranslation();
  const [fieldProps, { items, placeholder, creatable = false, emptyText }] = splitFieldProps<
    string,
    FormInputMenuProps
  >(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => inputRef.current?.focus(),
  });
  const { controlProps, ids } = field;
  const size = fieldProps.size ?? "md";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string | null>(null);
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);

  const all = normalizeItems(items);
  const selectedItem = all.find((item) => item.value === field.value);
  const text = query ?? (selectedItem ? itemText(selectedItem) : field.value);
  const filtered =
    query === null
      ? all
      : all.filter((item) => itemText(item).toLowerCase().includes(query.toLowerCase()));
  const listId = `${ids.id}-listbox`;

  const close = () => {
    setOpen(false);
    setQuery(null);
  };

  const choose = (index: number) => {
    const item = filtered[index];
    if (item) {
      field.setValue(item.value);
      close();
    } else if (creatable && query && query.trim()) {
      field.setValue(query.trim());
      close();
    }
  };

  const navigation = useListNavigation({
    count: filtered.length,
    isDisabled: (index) => Boolean(filtered[index]?.disabled),
    onSelect: choose,
  });

  return (
    <FormField {...field.shellProps}>
      <div className="relative">
        <Input
          ref={inputRef}
          {...controlProps}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && navigation.activeIndex >= 0
              ? optionId(listId, navigation.activeIndex)
              : undefined
          }
          autoComplete="off"
          placeholder={placeholder}
          value={text}
          disabled={fieldProps.disabled}
          readOnly={fieldProps.readOnly}
          required={fieldProps.required}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            navigation.setActiveIndex(0);
            if (creatable) field.setValue(event.target.value);
          }}
          onKeyDown={(event) => {
            if (locked) return;
            if (event.key === "ArrowDown" && !open) {
              event.preventDefault();
              setOpen(true);
              navigation.setActiveIndex(0);
            } else if (event.key === "Escape") {
              close();
            } else if (event.key === "Enter" && creatable && navigation.activeIndex < 0) {
              event.preventDefault();
              choose(-1);
            } else if (open) {
              navigation.onKeyDown(event);
            }
          }}
          onFocus={controlProps.onFocus}
          onBlur={() => {
            close();
            controlProps.onBlur();
          }}
          className={cn(fieldControlSize[size])}
        />
        {open && !locked && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
            <FormOptionList
              id={listId}
              items={filtered}
              selected={[field.value]}
              activeIndex={navigation.activeIndex}
              emptyText={creatable && query ? t("inputMenu.create", { query }) : emptyText}
              onActiveChange={navigation.setActiveIndex}
              onSelect={(item) => choose(filtered.indexOf(item))}
            />
          </div>
        )}
      </div>
      {fieldProps.name && <input type="hidden" name={fieldProps.name} value={field.value} />}
    </FormField>
  );
}
