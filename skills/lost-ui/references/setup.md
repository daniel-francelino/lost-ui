# Setup of an app

## Styles

```css
@import "tailwindcss";
@import "@danielsoaresf/lost-ui/styles.css"; /* token mapping, no brand values */
@import "@danielsoaresf/lost-ui/effects.css"; /* only with @danielsoaresf/lost-ui/effects */
@import "@danielsoaresf/lost-ui/theme-neutral.css"; /* optional default values; leave out when the app defines the tokens */
```

- `@danielsoaresf/lost-ui/styles.css` declares `@source "../dist"` itself, so Tailwind sees the classes of the library.
- The app defines the **values** of the tokens: `--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--success`, `--warning`, `--info` (each with `-foreground`), `--border`, `--input`, `--ring`, `--radius`, `--header-height`, `--container-width`, plus `--effect-from`/`--effect-to` and `--rainbow-1…5` when using effects. Fonts: `--font-sans`, `--font-display`.
- Dark mode is the `.dark` class on an ancestor.

## Wrap the app once

```tsx
import { App } from "@danielsoaresf/lost-ui/app/app"; // needs sonner

<App language={lang}>{/* router outlet */}</App>;
```

`App` joins the language provider, the tooltip provider and the `Toaster`. Without it: `LostI18nProvider` from `@danielsoaresf/lost-ui/i18n` plus one `<Toaster />` from `@danielsoaresf/lost-ui/ui/sonner`.

## Peers

Required: `react`, `react-dom`, `tailwindcss`, `tw-animate-css`, `motion`. Optional, installed only when the component that needs it is imported:

| Peer                                             | Needed by                                     |
| ------------------------------------------------ | --------------------------------------------- |
| `react-day-picker`                               | `Calendar`, `FormInputDate`                   |
| `input-otp`                                      | `InputOTP`, `FormPinInput`                    |
| `libphonenumber-js`, `country-flag-icons`        | `FormInputPhone`, `FormCountrySelect`         |
| `emoji-picker-react`                             | `FormEmojiPicker`                             |
| `sonner`                                         | `Toaster`, `toast`, `App`                     |
| `cmdk`, `vaul`                                   | `Command`, `Drawer`                           |
| `recharts`                                       | everything in `@danielsoaresf/lost-ui/charts` |
| `react-hook-form`                                | the shadcn `Form` primitive                   |
| `react-resizable-panels`, `embla-carousel-react` | `Resizable`, `Carousel`                       |

## Import paths

- Layer entry: `@danielsoaresf/lost-ui/ui`, `/elements`, `/app`, `/forms`, `/data`, `/charts`, `/templates`, `/effects`, `/i18n`. The root `lost-ui` exports `ui`, `elements`, `effects`, `data` and `i18n`.
- One component: `@danielsoaresf/lost-ui/<layer>/<folder>`, e.g. `@danielsoaresf/lost-ui/forms/form-input`.
- By path only (they need a peer): `@danielsoaresf/lost-ui/forms/{form-input-date,form-pin-input,form-input-phone,form-country-select,form-emoji-picker,form-builder}`, `@danielsoaresf/lost-ui/ui/{calendar,carousel,command,drawer,form,input-otp,resizable,sonner}`, `@danielsoaresf/lost-ui/app/app`.
- `@danielsoaresf/lost-ui/lib/cn` exports `cn`.
