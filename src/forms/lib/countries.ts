import {
  getCountries as listCountryCodes,
  getCountryCallingCode,
  type CountryCode,
} from "libphonenumber-js/min";

export type Country = {
  /** ISO 3166-1 alpha-2 code. */
  code: string;
  /** International calling code with the leading plus, e.g. `+351`. */
  dial: string;
  name: string;
};

/**
 * Every country known to libphonenumber-js, with its calling code and a name in
 * `locale` (from `Intl.DisplayNames`), sorted by name.
 */
export function getCountries(locale?: string): Country[] {
  const names = new Intl.DisplayNames(locale, { type: "region" });

  return listCountryCodes()
    .map((code: CountryCode) => ({
      code,
      dial: `+${getCountryCallingCode(code)}`,
      name: names.of(code) ?? code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}

/** The country whose calling code is the longest prefix of `phone`. */
export function countryFromPhone(phone: string, countries: Country[]): Country | undefined {
  return countries
    .filter((country) => phone.startsWith(country.dial))
    .sort((a, b) => b.dial.length - a.dial.length)[0];
}
