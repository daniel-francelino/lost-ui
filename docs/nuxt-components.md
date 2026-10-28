# Nuxt UI components in lost-ui

> **Status: implemented and tested (2026-10-28).** The Data, Element and Navigation groups of [Nuxt UI](https://ui.nuxt.com/docs/components) and what each one maps to here. Related: [forms.md](forms.md) for the Form group, [i18n.md](i18n.md).

Nuxt UI is Vue. The behaviour and the props were followed from its documentation and rewritten for React, with the library's own tokens and primitives. Names changed where they would clash: `Tree` is the file-tree effect, so the new one is `TreeView`; `User` is `UserInfo` (apps have their own `User` type); `FieldGroup` is `ButtonGroup`.

## Data

| Nuxt UI    | lost-ui                       | Import                    |
| ---------- | ----------------------------- | ------------------------- |
| Accordion  | `Accordion` (shadcn)          | `lost-ui/ui/accordion`    |
| Carousel   | `Carousel` (shadcn)           | `lost-ui/ui/carousel`     |
| Chart      | the `charts` layer            | `lost-ui/charts`          |
| Empty      | `Empty`                       | `lost-ui/data/empty`      |
| Marquee    | `Marquee` (effects)           | `lost-ui/effects/marquee` |
| ScrollArea | `ScrollArea` (shadcn)         | `lost-ui/ui/scroll-area`  |
| Table      | `DataTable` (new) and `Table` | `lost-ui/data/data-table` |
| Timeline   | `Timeline`                    | `lost-ui/data/timeline`   |
| Tree       | `TreeView`                    | `lost-ui/data/tree-view`  |
| User       | `UserInfo`                    | `lost-ui/data/user-info`  |

`DataTable` has three helpers with their own folders: `DataTablePagination`, `DataTableRowActions` and `DataTableColumnToggle`.

## Element

| Nuxt UI       | lost-ui                        | Import                            |
| ------------- | ------------------------------ | --------------------------------- |
| Alert         | `Alert` (shadcn)               | `lost-ui/ui/alert`                |
| Avatar        | `Avatar` (shadcn)              | `lost-ui/ui/avatar`               |
| AvatarGroup   | `AvatarGroup` (new)            | `lost-ui/elements/avatar-group`   |
| Badge         | `Badge` (shadcn)               | `lost-ui/ui/badge`                |
| Banner        | `Banner` (new)                 | `lost-ui/app/banner`              |
| Button        | `Button` (shadcn)              | `lost-ui/ui/button`               |
| Calendar      | `Calendar` (shadcn)            | `lost-ui/ui/calendar`             |
| Card          | `Card` (shadcn)                | `lost-ui/ui/card`                 |
| Chip          | `Chip` (new)                   | `lost-ui/elements/chip`           |
| Collapsible   | `Collapsible` (shadcn)         | `lost-ui/ui/collapsible`          |
| FieldGroup    | `ButtonGroup` (new)            | `lost-ui/elements/button-group`   |
| Icon          | not needed: use `lucide-react` |                                   |
| Kbd           | `Kbd` and `useKbd` (new)       | `lost-ui/elements/kbd`            |
| Progress      | `Progress` (shadcn)            | `lost-ui/ui/progress`             |
| ProgressGroup | `ProgressGroup` (new)          | `lost-ui/elements/progress-group` |
| Separator     | `Separator` (shadcn)           | `lost-ui/ui/separator`            |
| Skeleton      | `Skeleton` (shadcn)            | `lost-ui/ui/skeleton`             |

## Navigation

| Nuxt UI        | lost-ui                                               | Import                                                        |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| Breadcrumb     | `Breadcrumb` (shadcn)                                 | `lost-ui/ui/breadcrumb`                                       |
| CommandPalette | `Command` (shadcn, needs `cmdk`)                      | `lost-ui/ui/command`                                          |
| FooterColumns  | `FooterColumns` (new)                                 | `lost-ui/app/footer-columns`                                  |
| Link           | `Link` (new)                                          | `lost-ui/elements/link`                                       |
| NavigationMenu | `NavigationMenu` (shadcn)                             | `lost-ui/ui/navigation-menu`                                  |
| Pagination     | `Pagination` (shadcn parts) and `DataTablePagination` | `lost-ui/ui/pagination`, `lost-ui/data/data-table-pagination` |
| Stepper        | `Stepper` (new)                                       | `lost-ui/elements/stepper`                                    |
| Tabs           | `Tabs` (shadcn)                                       | `lost-ui/ui/tabs`                                             |

`Pagination` and `Tabs` are the shadcn compound parts, not Nuxt's data-driven versions with `items` or `total`; `DataTablePagination` is the data-driven bar for a total, a page and a page size.

## Layout

| Nuxt UI   | lost-ui                                | Import                    |
| --------- | -------------------------------------- | ------------------------- |
| App       | `App` (new, needs `sonner`)            | `lost-ui/app/app`         |
| Container | `Container` (new)                      | `lost-ui/app/container`   |
| Error     | `ErrorPage` (new)                      | `lost-ui/app/error-page`  |
| Footer    | `Footer` (new), `FooterColumns`        | `lost-ui/app/footer`      |
| Header    | `Header` (new)                         | `lost-ui/app/header`      |
| Main      | `Main` (new)                           | `lost-ui/app/main`        |
| Sidebar   | `Sidebar` (shadcn), `AppSidebar` (new) | `lost-ui/app/app-sidebar` |
| Splitter  | `Resizable` (shadcn)                   | `lost-ui/ui/resizable`    |
| Theme     | `Theme` (new)                          | `lost-ui/app/theme`       |

Differences from Nuxt UI:

- `Theme` scopes CSS variables (colours, `--radius`) and the dark mode of its children. It does not change the props of the components, as Nuxt's `UTheme` does.
- `App` joins the language (`LostI18nProvider`), the tooltip provider and the `Toaster`. `dir` only sets the attribute.
- `Header` opens its menu on small screens in a `Modal` or a `Slideover`; the drawer mode is not supported.
- `Footer` and `Main` use `--header-height` and `--container-width` (defaults in `theme-neutral.css`).
- The internal screens of an app (sidebar, top bar, bottom bar) are in [structure.md](structure.md).

## Overlay

| Nuxt UI      | lost-ui                           | Import                       |
| ------------ | --------------------------------- | ---------------------------- |
| ContextMenu  | `ContextMenu` (shadcn)            | `lost-ui/ui/context-menu`    |
| Drawer       | `Drawer` (shadcn, vaul)           | `lost-ui/ui/drawer`          |
| DropdownMenu | `DropdownMenu` (shadcn)           | `lost-ui/ui/dropdown-menu`   |
| Modal        | `Modal` (new, props over Dialog)  | `lost-ui/elements/modal`     |
| Popover      | `Popover` (shadcn)                | `lost-ui/ui/popover`         |
| Slideover    | `Slideover` (`Modal` with `side`) | `lost-ui/elements/slideover` |
| Toast        | `Toaster` and `toast` (sonner)    | `lost-ui/ui/sonner`          |
| Tooltip      | `Tooltip` (shadcn)                | `lost-ui/ui/tooltip`         |

`Modal` takes `title`, `description`, `actions`, `footer`, `dismissible`, `overlay`, `modal`, `fullscreen`, `scrollable`, `unmountOnHide` and `side` as props; `Slideover` is the same with `side` on the right by default.

## DataTable

The table was designed from how the two apps use their `DataTable` (server-side pages with `total`, `loading` and `refreshing`, selection by row ids across pages, row actions with a reason when blocked, `aria-sort`) and from the features of the Nuxt UI table.

```tsx
import { DataTable, type DataTableColumn } from "lost-ui/data";

const columns: DataTableColumn<User>[] = [
  { id: "name", header: "Name", accessor: "name", sortable: true },
  { id: "role", header: "Role", accessor: "role", sortable: true },
  { id: "created", header: "Created", accessor: "created", cell: (row) => formatDate(row.created) },
];

<DataTable
  data={users}
  columns={columns}
  caption="Users"
  rowLabel={(row) => row.name}
  searchable
  defaultPageSize={10}
  pageSizeOptions={[10, 25, 50]}
  selectable
  columnToggle
  actions={(row) => [{ id: "edit", label: "Edit", icon: PencilIcon, onSelect: edit }]}
/>;
```

| Feature           | Props                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Columns           | `columns` with `id`, `header`, `accessor`, `cell`, `footer`, `align`, `width`, `className`, `headerClassName`     |
| Sorting           | `sortable` per column, `sort` / `defaultSort` / `onSortChange`, `compare` per column, `manualSort`                |
| Search            | `searchable`, `search` / `defaultSearch` / `onSearchChange`, `searchable: false` per column, `manualSearch`       |
| Pagination        | `defaultPageSize` or `pageSize`, `page` / `defaultPage` / `onPageChange`, `pageSizeOptions`, `total` for a server |
| Selection         | `selectable`, `selected` / `defaultSelected` / `onSelectedChange`, `isRowSelectable`, `selectionDisabledReason`   |
| Expanded rows     | `renderExpanded`, `expanded` / `defaultExpanded` / `onExpandedChange`                                             |
| Rows with rows    | `getSubRows`: indents each level and opens everything that matches while searching                                |
| Column visibility | `columnToggle`, `columnVisibility` / `defaultColumnVisibility`, `defaultHidden` per column                        |
| Column pinning    | `pinned: "left" \| "right"` with a numeric `width`                                                                |
| Sticky header     | `sticky` with a height on `className`                                                                             |
| States            | `loading` / `loadingRows`, `refreshing`, `error` / `onRetry`, `empty`                                             |
| Row actions       | `actions` (up to two buttons, or a menu), `actionsMenu`                                                           |
| Events            | `onRowClick`, `onRowContextMenu` (clicks on a control inside the row are ignored), `rowClassName`                 |
| Look              | `striped`, `dense`, `toolbar`, `toolbarEnd`, `className`, `tableClassName`                                        |

State that can be controlled follows `value` / `defaultValue` / `onValueChange`, like the form fields. With a server, give the rows of the current page as `data`, the number of rows as `total`, and set `manualSort` and `manualSearch`: the table then only shows the state and asks for changes through the callbacks.

Not implemented from the Nuxt UI table: grouping with aggregation, virtualization, row pinning, merged cells (`colspan`, `rowspan`), drag and drop, infinite scroll and per-column filters. They were left out to keep the table small; the model (`table-model.ts`) is plain functions, so most of them can be added without rewriting the component.

## Verification

Every component has stories and tests. The tests run in jsdom: they prove structure, state, keyboard and behaviour, not layout, sticky columns or colours in a real browser.
