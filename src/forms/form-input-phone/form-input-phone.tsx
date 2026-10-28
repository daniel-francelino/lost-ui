import { useMemo, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { ChevronsUpDownIcon } from "lucide-react";
import { isValidPhoneNumber } from "libphonenumber-js/min";

import { cn } from "../../lib/cn";
import { useLostTranslation } from "../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { FormField } from "../form-field";
import { FormOptionList, optionId } from "../form-option-list";
import { countryFromPhone, getCountries, type Country } from "../lib/countries";
import { CountryFlag } from "../lib/country-flag";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { itemText, type FieldItem } from "../lib/items";
import { composeHandlers, splitFieldProps } from "../lib/split-field-props";
import { useControlled } from "../lib/use-controlled";
import { useField } from "../lib/use-field";
import { useListNavigation } from "../lib/use-list-navigation";

export type FormInputPhoneProps = FieldProps<string> &
  Omit<
    ComponentProps<"input">,
    keyof FieldProps<string> | "size" | "ref" | "type" | "defaultChecked"
  > & {
    /** Defaults to every country of libphonenumber-js, named in `locale`. */
    countries?: Country[];
    locale?: string;
    /** ISO code of the country shown when the value is empty. Defaults to the first country. */
    defaultCountry?: string;
    country?: string;
    onCountryChange?: (code: string) => void;
    countryLabel?: string;
    searchPlaceholder?: string;
    emptyText?: ReactNode;
  };

/**
 * True when `value` is a complete, valid international number for its country.
 * For a rule: `(value) => !value || isValidPhone(value) || "Enter a valid number"`.
 */
export function isValidPhone(value: string): boolean {
  return value !== "" && isValidPhoneNumber(value);
}

/**
 * A phone number in international format, `+` and the calling code followed by
 * the national digits, e.g. `+351912345678`. An empty number is `""`.
 * Needs the optional peers `libphonenumber-js` and `country-flag-icons`.
 */
export function FormInputPhone(props: FormInputPhoneProps) {
  const { t } = useLostTranslation();
  const [
    fieldProps,
    {
      countries,
      locale,
      defaultCountry,
      country: controlledCountry,
      onCountryChange,
      countryLabel,
      searchPlaceholder,
      emptyText,
      placeholder,
      onFocus,
      onBlur,
      ...rest
    },
  ] = splitFieldProps<string, FormInputPhoneProps>(props);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const field = useField<string>(fieldProps, {
    fallback: "",
    focus: () => inputRef.current?.focus(),
  });
  const { controlProps, ids } = field;
  const size = fieldProps.size ?? "md";
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);

  const list = useMemo(() => countries ?? getCountries(locale), [countries, locale]);
  const [chosen, setChosen] = useControlled<string>({
    ...(controlledCountry !== undefined ? { value: controlledCountry } : {}),
    defaultValue:
      defaultCountry ?? countryFromPhone(field.value, list)?.code ?? list[0]?.code ?? "",
    ...(onCountryChange ? { onValueChange: onCountryChange } : {}),
  });

  // A value typed or loaded from outside wins over the chosen country when its prefix differs.
  const chosenCountry = list.find((item) => item.code === chosen) ?? list[0];
  const selected =
    chosenCountry && (field.value === "" || field.value.startsWith(chosenCountry.dial))
      ? chosenCountry
      : (countryFromPhone(field.value, list) ?? chosenCountry);
  const dial = selected?.dial ?? "";
  const national = field.value.startsWith(dial) ? field.value.slice(dial.length) : "";

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const items: FieldItem[] = list.map((item) => ({
    value: item.code,
    label: item.name,
    description: item.dial,
    icon: <CountryFlag code={item.code} />,
    text: `${item.name} ${item.dial}`,
  }));
  const filtered = items.filter((item) =>
    itemText(item).toLowerCase().includes(query.toLowerCase()),
  );
  const listId = `${ids.id}-countries`;

  const choose = (index: number) => {
    const item = filtered[index];
    const next = list.find((country) => country.code === item?.value);
    if (!next) return;
    setChosen(next.code);
    if (national !== "") field.setValue(next.dial + national);
    setOpen(false);
    inputRef.current?.focus();
  };

  const navigation = useListNavigation({ count: filtered.length, onSelect: choose });

  return (
    <FormField {...field.shellProps}>
      <div className="flex gap-1">
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (next) {
              setQuery("");
              navigation.setActiveIndex(0);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              ref={triggerRef}
              type="button"
              variant="outline"
              role="combobox"
              aria-label={countryLabel ?? t("phone.countryLabel")}
              aria-expanded={open}
              aria-controls={listId}
              disabled={locked}
              className={cn(
                "shrink-0 justify-between gap-1 font-normal",
                fieldControlSize[size],
                "w-28",
              )}
            >
              {selected && <CountryFlag code={selected.code} />}
              <span>{dial}</span>
              <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-1">
            <Input
              autoFocus
              role="searchbox"
              aria-label={t("common.search")}
              aria-controls={listId}
              aria-activedescendant={
                navigation.activeIndex >= 0 ? optionId(listId, navigation.activeIndex) : undefined
              }
              placeholder={searchPlaceholder ?? t("phone.searchPlaceholder")}
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
              selected={selected ? [selected.code] : []}
              activeIndex={navigation.activeIndex}
              emptyText={emptyText}
              className="max-h-56 overflow-auto"
              onActiveChange={navigation.setActiveIndex}
              onSelect={(item) => choose(filtered.indexOf(item))}
            />
          </PopoverContent>
        </Popover>
        <Input
          ref={inputRef}
          {...rest}
          {...controlProps}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder ?? t("phone.placeholder")}
          value={national}
          disabled={fieldProps.disabled}
          readOnly={fieldProps.readOnly}
          required={fieldProps.required}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");
            field.setValue(digits === "" ? "" : dial + digits);
          }}
          onFocus={composeHandlers(controlProps.onFocus, onFocus)}
          onBlur={composeHandlers(controlProps.onBlur, onBlur)}
          className={cn(fieldControlSize[size], "min-w-0 flex-1")}
        />
      </div>
      {fieldProps.name && field.value !== "" && (
        <input type="hidden" name={fieldProps.name} value={field.value} />
      )}
    </FormField>
  );
}
