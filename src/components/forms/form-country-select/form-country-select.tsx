import { useMemo } from "react";
import { useLostTranslation } from "../../../i18n/use-lost-translation";

import { FormInputMenu, type FormInputMenuProps } from "../form-input-menu";
import { getCountries, type Country } from "../lib/countries";
import { CountryFlag } from "../lib/country-flag";

export type FormCountrySelectProps = Omit<FormInputMenuProps, "items" | "creatable"> & {
  /** Defaults to every country of libphonenumber-js, named in `locale`. */
  countries?: Country[];
  locale?: string;
};

/**
 * A searchable country picker. The value is the ISO 3166-1 alpha-2 code.
 * Needs the optional peers `libphonenumber-js` and `country-flag-icons`.
 */
export function FormCountrySelect({
  countries,
  locale,
  placeholder,
  ...props
}: FormCountrySelectProps) {
  const { t } = useLostTranslation();
  const items = useMemo(
    () =>
      (countries ?? getCountries(locale)).map((country) => ({
        value: country.code,
        label: country.name,
        icon: <CountryFlag code={country.code} />,
      })),
    [countries, locale],
  );

  return (
    <FormInputMenu {...props} placeholder={placeholder ?? t("country.placeholder")} items={items} />
  );
}
