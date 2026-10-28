# Catalog

Every folder is importable as `lost-ui/<layer>/<folder>`; the layer entry (`lost-ui/<layer>`) exports all of them except the ones noted. Generated from the folders of the library; each has a story (`<name>.stories.tsx`) that shows how to use it.

## ui (`lost-ui/ui`)

shadcn primitives, upstream shape. Peers by path: calendar, carousel, command, drawer, form, input-otp, resizable, sonner.

`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `input-otp`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toggle`, `toggle-group`, `tooltip`

## elements (`lost-ui/elements`)

small pieces made of primitives.

`avatar-group`, `button-group`, `chip`, `kbd`, `link`, `modal`, `page-transition`, `progress-group`, `slideover`, `stepper`

## app (`lost-ui/app`)

the frame of an app. `app` needs `sonner` and is imported by path (`lost-ui/app/app`). `app-nav` has the `NavItem` types and helpers, no component.

`app`, `app-nav`, `app-shell`, `app-sidebar`, `app-topbar`, `banner`, `bottom-nav`, `container`, `error-page`, `footer`, `footer-columns`, `header`, `main`, `notification-button`, `notification-item`, `notification-preferences`, `page-header`, `settings-section`, `sidebar`, `space-switcher`, `theme`, `user-menu`

## forms (`lost-ui/forms`)

`form-input-date`, `form-pin-input`, `form-input-phone`, `form-country-select`, `form-emoji-picker` and `form-builder` need optional peers and are imported by path.

`form`, `form-builder`, `form-checkbox`, `form-checkbox-group`, `form-color-picker`, `form-country-select`, `form-emoji-picker`, `form-field`, `form-fieldset`, `form-file-upload`, `form-input`, `form-input-date`, `form-input-menu`, `form-input-money`, `form-input-number`, `form-input-password`, `form-input-phone`, `form-input-rating`, `form-input-tags`, `form-input-time`, `form-listbox`, `form-option-list`, `form-pin-input`, `form-radio-group`, `form-select`, `form-select-menu`, `form-slider`, `form-switch`, `form-textarea`, `rules`

## data (`lost-ui/data`)

data display.

`data-table`, `data-table-column-toggle`, `data-table-pagination`, `data-table-row-actions`, `empty`, `timeline`, `tree-view`, `user-info`

## charts (`lost-ui/charts`)

`*-chart` are the data-driven ones; the other folders are the pieces they are made of.

`area-chart`, `bar-chart`, `chart-center-label`, `chart-container`, `chart-legend`, `chart-legend-content`, `chart-series`, `chart-style`, `chart-tooltip`, `chart-tooltip-content`, `line-chart`, `pie-chart`, `radar-chart`, `radial-chart`

## templates (`lost-ui/templates`)

pages and layouts reused between projects. `lib` holds helpers, not for import.

`auth-layout`, `auth-message-page`, `backoffice-layout`, `error-fallback`, `forbidden-page`, `forgot-password-page`, `login-page`, `not-found-page`, `notifications-page`, `profile-page`, `register-page`, `reset-password-page`, `settings-index-page`, `settings-layout`

## effects (`lost-ui/effects`)

79 landing-page animations from Magic UI (marquee, globe, confetti, blur-fade, number-ticker…). Names, paths and optional peers: the library's `docs/effects-inventory.md`.

## i18n (`lost-ui/i18n`)

`LostI18nProvider`, `useLostTranslation`, `translate`, `registerMessages`, `lostI18n`.
