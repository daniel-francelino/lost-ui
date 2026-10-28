export const en = {
  common: {
    close: "Close",
    loading: "Loading",
    search: "Search",
    noResults: "No results",
  },
  form: {
    submit: "Submit",
    reset: "Reset",
  },
  inputMenu: {
    create: "Create “{{query}}”",
  },
  selectMenu: {
    placeholder: "Select…",
    searchPlaceholder: "Search…",
    selected: "{{count}} selected",
  },
  date: {
    placeholder: "Pick a date",
    clear: "Clear date",
    time: "Time",
    done: "Done",
  },
  number: {
    increment: "Increment",
    decrement: "Decrement",
  },
  phone: {
    placeholder: "Phone number",
    countryLabel: "Country calling code",
    searchPlaceholder: "Search a country",
  },
  country: {
    placeholder: "Search a country",
  },
  emoji: {
    placeholder: "Pick an emoji",
    searchPlaceholder: "Search emoji",
    clear: "Clear emoji",
  },
  color: {
    pick: "Pick a color",
    swatches: "Swatches",
    use: "Use {{color}}",
  },
  file: {
    dropzone: "Drop files here or click to browse",
    remove: "Remove {{name}}",
  },
  tags: {
    remove: "Remove {{tag}}",
  },
  breadcrumb: {
    more: "More",
  },
  carousel: {
    previous: "Previous slide",
    next: "Next slide",
  },
  pagination: {
    previous: "Go to previous page",
    previousLabel: "Previous",
    nextLabel: "Next",
    next: "Go to next page",
    more: "More pages",
  },
  sidebar: {
    toggle: "Toggle Sidebar",
  },
  rules: {
    required: "This field is required",
    requiredIf: "This field is required",
    minLength: "Use at least {{limit}} characters",
    maxLength: "Use at most {{limit}} characters",
    minItems: "Choose at least {{limit}} items",
    maxItems: "Choose at most {{limit}} items",
    min: "Must be at least {{limit}}",
    max: "Must be at most {{limit}}",
    between: "Must be between {{min}} and {{max}}",
    integer: "Must be a whole number",
    email: "Enter a valid email",
    url: "Enter a valid URL",
    pattern: "Invalid format",
    oneOf: "Choose a valid option",
    matches: "Values do not match",
    minDate: "Choose {{limit}} or later",
    maxDate: "Choose {{limit}} or earlier",
    fileSize: "Each file must be at most {{limit}}",
    fileType: "File type not allowed",
  },
};

type Strings<T> = { [K in keyof T]: T[K] extends string ? string : Strings<T[K]> };

/** The shape every language must fill: the same keys as English, all strings. */
export type Messages = Strings<typeof en>;
