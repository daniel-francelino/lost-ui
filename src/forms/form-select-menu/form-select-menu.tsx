import { useRef, useState, type ReactNode } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { FormField } from "../form-field";
import { FormOptionList, optionId } from "../form-option-list";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { itemText, normalizeItems, type ItemInput } from "../lib/items";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";
import { useListNavigation } from "../lib/use-list-navigation";

export type FormSelectMenuValue = string | string[];

export type FormSelectMenuProps = FieldProps<FormSelectMenuValue> & {
  items: ItemInput[];
  multiple?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: ReactNode;
};

export function FormSelectMenu(props: FormSelectMenuProps) {
  const [
    fieldProps,
    { items, multiple = false, placeholder = "Select…", searchPlaceholder = "Search…", emptyText },
  ] = splitFieldProps<FormSelectMenuValue, FormSelectMenuProps>(props);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const field = useField<FormSelectMenuValue>(fieldProps, {
    fallback: multiple ? [] : "",
    focus: () => triggerRef.current?.focus(),
  });
  const { controlProps, ids } = field;
  const size = fieldProps.size ?? "md";
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);

  const all = normalizeItems(items);
  const selected = Array.isArray(field.value) ? field.value : field.value ? [field.value] : [];
  const filtered = all.filter((item) => itemText(item).toLowerCase().includes(query.toLowerCase()));
  const listId = `${ids.id}-listbox`;
  const labels = selected
    .map((value) => all.find((item) => item.value === value))
    .filter((item) => item !== undefined)
    .map((item) => itemText(item));

  const choose = (index: number) => {
    const item = filtered[index];
    if (!item || item.disabled) return;

    if (multiple) {
      field.setValue(
        selected.includes(item.value)
          ? selected.filter((value) => value !== item.value)
          : [...selected, item.value],
      );
    } else {
      field.setValue(item.value);
      setOpen(false);
    }
  };

  const navigation = useListNavigation({
    count: filtered.length,
    isDisabled: (index) => Boolean(filtered[index]?.disabled),
    onSelect: choose,
  });

  return (
    <FormField {...field.shellProps}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) {
            setQuery("");
            navigation.setActiveIndex(0);
          } else {
            controlProps.onBlur();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            role="combobox"
            id={controlProps.id}
            aria-expanded={open}
            aria-controls={listId}
            aria-labelledby={fieldProps.label ? `${ids.labelId} ${ids.id}-value` : undefined}
            aria-invalid={controlProps["aria-invalid"]}
            aria-describedby={controlProps["aria-describedby"]}
            disabled={locked}
            onFocus={controlProps.onFocus}
            className={cn("w-full justify-between font-normal", fieldControlSize[size])}
          >
            <span
              id={`${ids.id}-value`}
              className={cn("truncate", labels.length === 0 && "text-muted-foreground")}
            >
              {labels.length === 0
                ? placeholder
                : multiple && labels.length > 2
                  ? `${labels.length} selected`
                  : labels.join(", ")}
            </span>
            <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-1">
          <Input
            autoFocus
            role="searchbox"
            aria-label="Search"
            aria-controls={listId}
            aria-activedescendant={
              navigation.activeIndex >= 0 ? optionId(listId, navigation.activeIndex) : undefined
            }
            placeholder={searchPlaceholder}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              navigation.setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
              else navigation.onKeyDown(event);
            }}
            className="mb-1 h-8"
          />
          <FormOptionList
            id={listId}
            items={filtered}
            selected={selected}
            multiple={multiple}
            activeIndex={navigation.activeIndex}
            emptyText={emptyText}
            className="max-h-56 overflow-auto"
            onActiveChange={navigation.setActiveIndex}
            onSelect={(item) => choose(filtered.indexOf(item))}
          />
        </PopoverContent>
      </Popover>
      {fieldProps.name &&
        selected.map((value) => (
          <input key={value} type="hidden" name={fieldProps.name} value={value} />
        ))}
    </FormField>
  );
}
