export type Country = {
  /** ISO 3166-1 alpha-2 code. */
  code: string;
  /** International calling code with the leading plus, e.g. `+351`. */
  dial: string;
  name: string;
  flag: string;
};

const entries: [code: string, dial: string][] = [
  ["AE", "+971"],
  ["AO", "+244"],
  ["AR", "+54"],
  ["AT", "+43"],
  ["AU", "+61"],
  ["BE", "+32"],
  ["BO", "+591"],
  ["BR", "+55"],
  ["CA", "+1"],
  ["CH", "+41"],
  ["CL", "+56"],
  ["CN", "+86"],
  ["CO", "+57"],
  ["CU", "+53"],
  ["CV", "+238"],
  ["CZ", "+420"],
  ["DE", "+49"],
  ["DK", "+45"],
  ["DZ", "+213"],
  ["EC", "+593"],
  ["EG", "+20"],
  ["ES", "+34"],
  ["FI", "+358"],
  ["FR", "+33"],
  ["GB", "+44"],
  ["GH", "+233"],
  ["GR", "+30"],
  ["GW", "+245"],
  ["HK", "+852"],
  ["HU", "+36"],
  ["ID", "+62"],
  ["IE", "+353"],
  ["IL", "+972"],
  ["IN", "+91"],
  ["IT", "+39"],
  ["JP", "+81"],
  ["KE", "+254"],
  ["KR", "+82"],
  ["LU", "+352"],
  ["MA", "+212"],
  ["MX", "+52"],
  ["MY", "+60"],
  ["MZ", "+258"],
  ["NG", "+234"],
  ["NL", "+31"],
  ["NO", "+47"],
  ["NZ", "+64"],
  ["PE", "+51"],
  ["PH", "+63"],
  ["PK", "+92"],
  ["PL", "+48"],
  ["PT", "+351"],
  ["PY", "+595"],
  ["RO", "+40"],
  ["RU", "+7"],
  ["SA", "+966"],
  ["SE", "+46"],
  ["SG", "+65"],
  ["ST", "+239"],
  ["TH", "+66"],
  ["TL", "+670"],
  ["TN", "+216"],
  ["TR", "+90"],
  ["TW", "+886"],
  ["UA", "+380"],
  ["US", "+1"],
  ["UY", "+598"],
  ["VE", "+58"],
  ["VN", "+84"],
  ["ZA", "+27"],
];

/** Flag emoji built from the two regional indicator symbols of the code. */
export function countryFlag(code: string): string {
  return Array.from(code.toUpperCase(), (letter) =>
    String.fromCodePoint(0x1f1e6 + letter.charCodeAt(0) - 65),
  ).join("");
}

/**
 * Countries with a flag, a calling code and a name in `locale`, sorted by name.
 * Names come from `Intl.DisplayNames`, so no translation table is shipped.
 */
export function getCountries(locale?: string): Country[] {
  const names = new Intl.DisplayNames(locale, { type: "region" });

  return entries
    .map(([code, dial]) => ({
      code,
      dial,
      name: names.of(code) ?? code,
      flag: countryFlag(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, locale));
}

/** The country whose calling code is the longest prefix of `phone`. */
export function countryFromPhone(phone: string, countries: Country[]): Country | undefined {
  return countries
    .filter((country) => phone.startsWith(country.dial))
    .sort((a, b) => b.dial.length - a.dial.length)[0];
}
