# Notifications

> **Status: implemented and tested (2026-10-28).** The `Toaster` in `@danielsoaresf/lost-ui/ui/sonner`, on top of [sonner](https://sonner.emilkowal.ski). Related: [stack.md](stack.md), [i18n.md](i18n.md).

## 1. Pattern

Both apps use sonner with the same set-up: `richColors`, a fill colour per kind, a Lucide icon per kind and `toast.success|error|info|warning` at the call sites. The library `Toaster` is that set-up with **semantic tokens** instead of each app's brand colours, so an app only sets the tokens.

| Kind    | Icon                      | Fill             | Text                       |
| ------- | ------------------------- | ---------------- | -------------------------- |
| success | `CircleCheck`             | `--success`      | `--success-foreground`     |
| error   | `CircleAlert`             | `--destructive`  | `--destructive-foreground` |
| warning | `TriangleAlert`           | `--warning`      | `--warning-foreground`     |
| info    | `Info`                    | `--info`         | `--info-foreground`        |
| loading | `LoaderCircle` (spinning) | the normal toast | the normal toast           |

`--success`, `--warning` and `--info` (and their `-foreground`) are new in `theme-neutral.css`, with a light and a dark value, and are available as Tailwind colours (`bg-success`, `text-warning-foreground`…). An app that already has brand colours maps them: `--success: var(--cacto)`.

## 2. Using it

```tsx
import { Toaster, toast } from "@danielsoaresf/lost-ui/ui/sonner";

<Toaster />; // once, near the root

toast.success("Saved");
toast.error("Could not save", { description: "Try again." });
toast.warning("Unsaved changes");
toast.promise(save(), { loading: "Saving", success: "Saved", error: "Failed" });
```

`toast` is re-exported so an app has one import. The theme follows the `dark` class, and any `Toaster` prop (position, duration, `closeButton`) is passed on.

## 3. Verification

Tests check the type, the rich colours and the icon of each kind, the spinner for `loading` and the tokens set on the toaster. Colours and layout were not checked in a browser.
