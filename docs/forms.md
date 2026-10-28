# Forms

> **Status: implemented and tested (2026-10-28).** 26 components in `src/components/forms/`, exposed as `@danielsoaresf/lost-ui/forms`. Related: [stack.md](stack.md), [pending.md](pending.md).

## 1. Goal

A form layer where **each field carries its own `rules`**, validated the way Quasar's `QForm` does it, with the field set of Nuxt UI's Form section, and a `FormBuilder` that assembles a whole form from a list of fields.

Sources read: Quasar `QForm.js` and `use-validate.js` (MIT), and the Nuxt UI component list. The behaviour was reimplemented in React from those sources, not copied.

## 2. Architecture

```
Form (QForm)            owns the list of registered fields, runs validation, submit, reset, focus
  └─ Form<Field>        each control: useField() = controlled/uncontrolled value + useFieldValidation()
       └─ FormField     label, hint, description, help, error message, ids, aria wiring
```

- A field **registers itself** with the nearest `Form` (`useFormChild`) and unregisters on unmount. A field outside a `Form` works on its own.
- `Form` does **not store values**, exactly like QForm. Values live in the field (uncontrolled) or in the parent (`value` + `onValueChange`). `FormBuilder` is the layer that stores them.
- Every control is built on the library's own `ui` primitives (`Input`, `Select`, `Slider`, …), so theming is the same as the rest of the library.

## 3. Quasar parity

| Quasar                                                                                                      | lost-ui                                                                  | Notes                                                                   |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Rule `(val, rules) => true \| false \| string \| Promise`                                                   | same, on `rules`                                                         | string = error message; `false` = invalid without message               |
| Rule as a pattern name (`"email"`)                                                                          | same                                                                     | unknown names fail instead of passing                                   |
| Synchronous rules run in order, first failure stops                                                         | same                                                                     | async rules are awaited together                                        |
| `lazyRules` `false`                                                                                         | validates on every change                                                |                                                                         |
| `lazyRules` `true`                                                                                          | validates on blur, then on every change while an error shows             |                                                                         |
| `lazyRules="ondemand"`                                                                                      | only when the form asks                                                  |                                                                         |
| `reactiveRules`                                                                                             | same                                                                     | re-validates when the `rules` array identity changes; memoise the array |
| `error`, `errorMessage`                                                                                     | same                                                                     | external error wins over the inner one                                  |
| Stale async result protection                                                                               | same                                                                     | a newer validation discards an older result                             |
| Re-validate if the value changed while an async rule ran                                                    | same                                                                     |                                                                         |
| `QForm` `autofocus`, `noErrorFocus`, `noResetFocus`, `greedy`                                               | same                                                                     |                                                                         |
| `validate(shouldFocus)`, `resetValidation()`, `submit()`, `reset()`, `focus()`, `getValidationComponents()` | same, through a `ref` (`FormHandle`)                                     |                                                                         |
| `@submit`, `@reset`, `@validation-success`, `@validation-error`                                             | `onSubmit`, `onReset`, `onValidationSuccess`, `onValidationError(child)` |                                                                         |
| Sequential validation, `greedy` validates all                                                               | same                                                                     |                                                                         |
| Focus first field with an error                                                                             | same                                                                     |                                                                         |
| Native `form.submit()` when there is no `onSubmit`                                                          | same                                                                     |                                                                         |
| `modelValue` / `update:modelValue`                                                                          | `value` / `onValueChange`                                                | React convention, same as the Radix-based `ui`                          |
| `noErrorIcon`                                                                                               | not implemented                                                          |                                                                         |

Differences on purpose: `Form` sets `noValidate` so the browser's own bubbles do not pre-empt the rules, and error messages are rendered under the field with `role="alert"` and linked with `aria-describedby`.

## 4. Components

Names carry a `Form` prefix so they cannot be confused with the `ui` primitives of the same name (`FormInput` wraps `ui/Input`). Import from `@danielsoaresf/lost-ui/forms`, or by path for the three that need an optional peer.

| Nuxt UI       | Component           | Value                            | Main props                                                                                                                      |
| ------------- | ------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Form          | `Form`              |                                  | `autofocus`, `noErrorFocus`, `noResetFocus`, `greedy`, `onSubmit`, `onReset`, `onValidationSuccess`, `onValidationError`, `ref` |
| FormField     | `FormField`         |                                  | `label`, `description`, `hint`, `help`, `required`, `size`, `invalid`, `errorMessage`, `orientation`                            |
| Input         | `FormInput`         | `string`                         | `type`, `leading`, `trailing`, `loading`, native input props                                                                    |
| Textarea      | `FormTextarea`      | `string`                         | `rows`, `autoresize`, `maxRows`                                                                                                 |
| Checkbox      | `FormCheckbox`      | `boolean`                        | `indeterminate`                                                                                                                 |
| Switch        | `FormSwitch`        | `boolean`                        |                                                                                                                                 |
| CheckboxGroup | `FormCheckboxGroup` | `string[]`                       | `items`, `orientation`                                                                                                          |
| RadioGroup    | `FormRadioGroup`    | `string`                         | `items`, `orientation`                                                                                                          |
| Select        | `FormSelect`        | `string`                         | `items`, `placeholder`                                                                                                          |
| SelectMenu    | `FormSelectMenu`    | `string` or `string[]`           | `items`, `multiple`, `placeholder`, `searchPlaceholder`, `emptyText`                                                            |
| InputMenu     | `FormInputMenu`     | `string`                         | `items`, `creatable`, `placeholder`, `emptyText`                                                                                |
| Listbox       | `FormListbox`       | `string` or `string[]`           | `items`, `multiple`, `emptyText`, `maxHeight`                                                                                   |
| Slider        | `FormSlider`        | `number` or `number[]`           | `min`, `max`, `step`, `orientation`, `showValue` (an array value makes it a range)                                              |
| PinInput      | `FormPinInput`      | `string`                         | `length`, `type`, `groupSize`, `onComplete`                                                                                     |
| InputNumber   | `FormInputNumber`   | `number \| null`                 | `min`, `max`, `step`, `showControls`                                                                                            |
| InputRating   | `FormInputRating`   | `number`                         | `max`, `icon`, `clearable`                                                                                                      |
| InputTags     | `FormInputTags`     | `string[]`                       | `max`, `delimiter`, `allowDuplicates`, `addOnBlur`                                                                              |
| InputTime     | `FormInputTime`     | `string` (`HH:mm`)               | `seconds`, `min`, `max`, `step`                                                                                                 |
| InputDate     | `FormInputDate`     | `Date \| null` or `{ from, to }` | `mode`, `min`, `max`, `locale`, `clearable`, `numberOfMonths`                                                                   |
| ColorPicker   | `FormColorPicker`   | `string` (hex)                   | `swatches`, `placeholder`                                                                                                       |
| FileUpload    | `FormFileUpload`    | `File[]`                         | `accept`, `multiple`, `maxSize`, `dropzoneText`, `onReject`                                                                     |
| InputMoney    | `FormInputMoney`    | `number \| null`                 | `currency`, `locale`, `fractionDigits`, `min`, `max` (typing fills the cents first)                                             |
| InputPhone    | `FormInputPhone`    | `string` (`+351912345678`)       | `countries`, `locale`, `defaultCountry`, `country`, `onCountryChange`; `isValidPhone(value)` for a rule                         |
| CountrySelect | `FormCountrySelect` | `string` (ISO code)              | `countries`, `locale`, plus the `FormInputMenu` props                                                                           |
| EmojiPicker   | `FormEmojiPicker`   | `string`                         | `placeholder`, `searchPlaceholder`, `clearable`, `pickerProps` (passed to `emoji-picker-react`)                                 |
| Fieldset      | `FormFieldset`      |                                  | `legend`, `description`, `icon`, `hideLegend`, `variant` (`plain`, `section`, `boxed`), `gap`, `disabled`                       |
|               | `FormOptionList`    |                                  | internal list used by the menus and the listbox                                                                                 |
|               | `FormBuilder`       | `Record<string, unknown>`        | see section 6                                                                                                                   |

Every field shares the same props (`FieldProps<T>`): `id`, `name`, `label`, `description`, `hint`, `help`, `value`, `defaultValue`, `onValueChange`, `rules`, `lazyRules`, `reactiveRules`, `error`, `errorMessage`, `disabled`, `readOnly`, `required`, `size` (`xs` to `xl`), `className`.

Where Nuxt UI is richer, this implementation is smaller: `FormInputTime` uses the native time input (no segments), `FormInputDate` has a single time field (`time`, no seconds), `FormInputMenu` is single-select, `FormInputNumber` has no `formatOptions`, `FormInputRating` has no half stars, `FormFileUpload` has no thumbnails or layout variants, and there is no schema validation (zod or yup): validation is per field through `rules`.

## 5. Rules

```tsx
import { Form, FormInput, rules } from "@danielsoaresf/lost-ui/forms";

<Form onSubmit={(event) => save(new FormData(event.currentTarget))}>
  <FormInput
    name="email"
    label="Email"
    required
    rules={[
      rules.required("Email is required"),
      (value, test) => test.email(value) || "Enter a valid email",
      async (value) => (await isFree(value)) || "Already registered",
    ]}
  />
  <button type="submit">Save</button>
</Form>;
```

Helpers in `rules` (a rule with no message argument writes its message in the current language, see [i18n.md](i18n.md)):

| Group       | Rules                                                                                         |
| ----------- | --------------------------------------------------------------------------------------------- |
| Presence    | `required`, `requiredIf(condition)`                                                           |
| Text/lists  | `minLength`, `maxLength` (characters of a text, items of a list), `minItems`, `maxItems`      |
| Numbers     | `min`, `max`, `between`, `integer`                                                            |
| Format      | `email`, `url`, `pattern`, `oneOf` (also a list whose items are all allowed), `matches`       |
| Dates       | `minDate`, `maxDate` (a `Date`, or both ends of a `{ from, to }` range)                       |
| Files       | `fileSize(bytes)`, `fileType(accept)` for a `File[]`                                          |
| Combinators | `when(condition, rule)`, `debounce(rule, delay)` for a request that must not fire on each key |

Length, number, date, file and format helpers pass on an empty value, so they combine with `required` instead of repeating it. A phone number is checked with `isValidPhone` from `@danielsoaresf/lost-ui/forms/form-input-phone`.

```tsx
rules={[
  rules.required(),                                      // default message, in the language set
  rules.requiredIf(() => business),                      // only while "business" is on
  rules.debounce(async (value) => (await isFree(value)) || "Already registered", 400),
]}
```

`debounce` keeps a timer, so make one per field and do not share it. Rules read the language when they run, so a field already on screen shows the new language at its next validation. `patterns` (also passed as the second argument of every rule) holds `email`, `url`, `date`, `time`, `fulltime`, `hexColor`, `hexaColor`, `hexOrHexaColor`, `rgbColor`, `integer`, `number`.

Calling the form from code:

```tsx
const form = useRef<FormHandle>(null);
await form.current?.validate(); // true or false, focuses the first invalid field
form.current?.resetValidation();
```

### Masks

`FormInput` takes a `mask`, after Quasar's `QInput`:

```tsx
<FormInput label="Phone" mask="(##) #####-####" />
<FormInput label="CPF or CNPJ" mask={["###.###.###-##", "##.###.###/####-##"]} />
<FormInput label="Plate" mask="AAA-#X##" unmask />
<FormInput
  mask="#HHHHHH"
  maskTokens={{ H: { pattern: /[0-9a-f]/i, transform: (char) => char.toUpperCase() } }}
/>
```

| Slot | Accepts             |     | Slot | Accepts                       |
| ---- | ------------------- | --- | ---- | ----------------------------- |
| `#`  | a digit             |     | `A`  | a letter, in upper case       |
| `S`  | a letter            |     | `a`  | a letter, in lower case       |
| `N`  | a letter or a digit |     | `X`  | a letter or digit, upper case |
|      |                     |     | `x`  | a letter or digit, lower case |

Any other character is a literal; `` before a slot character makes it a literal. `maskTokens` adds slots or replaces one. An array of masks uses the shortest one that holds everything typed. By default the value keeps the literals (`(11) 98765-4321`); with `unmask` the value is only what was typed (`11987654321`), the input still shows the mask, and a `name` is submitted without the literals. Rules run on the value, so with `unmask` they see the unmasked text. `applyMask` and `unmaskValue` are exported for use outside the field.

## 6. FormBuilder

```tsx
<FormBuilder
  columns={2}
  defaultValues={{ country: "pt" }}
  onSubmit={(values) => save(values)}
  showReset
  fields={[
    { control: "input", name: "email", label: "Email", type: "email", rules: [rules.email()] },
    { control: "select", name: "country", label: "Country", items: ["pt", "br"] },
    { control: "textarea", name: "bio", label: "Bio", colSpan: "full" },
    { control: "switch", name: "business", label: "Business account", colSpan: "full" },
    {
      control: "input",
      name: "company",
      label: "Company",
      visible: (values) => values.business === true,
    },
  ]}
/>
```

- `control` picks the component (one of the 23 field kinds) and the rest of the object is that component's props, typed per `control`. It is named `control` because `type` collides with native props (`<input type>`).
- `visible` accepts a boolean or a function of the current values. `colSpan` is `1` to `4` or `"full"`; `columns` is `1` to `4` and collapses to one column on small screens.
- Values are held by the builder, or controlled with `values` and `onValuesChange`. `onSubmit` receives them only after every rule passed. `reset` restores `defaultValues`.
- `formRef` exposes the `FormHandle`; `greedy`, `autofocus`, `noErrorFocus` pass through to `Form`.

## 7. Accessibility

- Label, description, help and error are linked: `aria-describedby` points at the description and at the error (or the help when there is no error); `aria-invalid` and `aria-required` are set.
- Group controls (radio group, checkbox group, rating, listbox) are labelled with `aria-labelledby`.
- Trigger buttons (`FormSelectMenu`, `FormInputDate`) are named by label **and** value (`aria-labelledby` on the label and on the value text). A plain `<label for>` would replace the button content, so a screen reader would announce "Birthday" without the chosen date.
- The error message has `role="alert"`.

## 8. Entries and peers

`@danielsoaresf/lost-ui/forms` exports everything except three components that need an optional peer, imported by path:

| Path                                               | Needs                                             |
| -------------------------------------------------- | ------------------------------------------------- |
| `@danielsoaresf/lost-ui/forms/form-input-date`     | `react-day-picker`                                |
| `@danielsoaresf/lost-ui/forms/form-pin-input`      | `input-otp`                                       |
| `@danielsoaresf/lost-ui/forms/form-input-phone`    | `libphonenumber-js`, `country-flag-icons`         |
| `@danielsoaresf/lost-ui/forms/form-country-select` | `libphonenumber-js`, `country-flag-icons`         |
| `@danielsoaresf/lost-ui/forms/form-emoji-picker`   | `emoji-picker-react`                              |
| `@danielsoaresf/lost-ui/forms/form-builder`        | all of the above (it can render every field kind) |

All of these peers are optional: an app installs one only when it imports the component that needs it. The country list and calling codes come from `libphonenumber-js` (names from `Intl.DisplayNames`), the flags are SVG from `country-flag-icons` (flag emoji do not render on Windows), and the emoji grid is `emoji-picker-react`.

The menus and the listbox are implemented here, without `cmdk`.

## 9. Fixes made to the primitives on the way

- **`ui/slider`** always drew one thumb, so a range slider was impossible. It now draws one per value.
- **`ui/progress`** never passed `value` to Radix (see [pending.md](pending.md)); fixed in the library earlier.

## 10. Verification

- `tsc --noEmit` and Prettier pass; the package builds and the new entries import from an installed tarball.
- 26 components, each with stories and a test file. Behaviour tests use `userEvent` and cover typing, selection, keyboard, `lazyRules` in all three modes, `reactiveRules`, asynchronous rules, external `error`, integration with `Form` (submit blocked until valid, focus on the first error, greedy, reset) and `FormBuilder` end to end.
- The tests run in jsdom: they prove structure, state and behaviour, not layout or pixels. Radix focus movement on arrow keys is asserted as focus, not as the selection change.

## 11. Added from aura-creative and memoria-print

`FormInputMoney`, `FormInputPhone`, `FormCountrySelect`, `FormEmojiPicker` and `FormFieldset`, plus the `time` prop of `FormInputDate`, are the generic form of fields the two apps had written by hand (`MoneyField`, `PhoneField`, `CountryField`, `EmojiPickerField`, `FieldGroup`, `DateTimeField`). The app-specific parts stayed out: time-zone and daylight-saving resolution of `DateTimeField`, the Portuguese texts, and the app's own phone and country helpers.

- `FormFieldset` is a native `fieldset`: `disabled` switches off every control inside, and it is not a field (no `rules`, no registration with `Form`).
- `FormInputPhone` keeps `+<code><digits>` as the value and chooses the country from the value's calling code when it differs from the selected one. Validate with `isValidPhone`.
- `FormBuilder` renders the four new fields as `input-money`, `input-phone`, `country-select` and `emoji-picker`; the date with time is `input-date` with `time: true`. It has no `fieldset` entry yet.
- The emoji grid of `emoji-picker-react` cannot render in jsdom (it measures elements), so its test uses a stub picker and checks the integration: props, choice, closing, form value. The real grid was not checked in a browser.
