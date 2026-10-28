import type { ComponentType } from "react";
import { MoreHorizontal } from "lucide-react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export type DataTableAction<T> = {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
  onSelect: (row: T) => void;
  destructive?: boolean;
  disabled?: boolean;
  /** Why the action is blocked. Setting it disables the action and shows the reason. */
  disabledReason?: string | null | undefined;
};

export type DataTableRowActionsProps<T> = {
  row: T;
  /** Names the row for screen readers, e.g. "Edit: Ada". */
  label: string;
  actions: DataTableAction<T>[];
  disabled?: boolean;
  /** Always use the menu. By default up to two actions are shown as buttons. */
  forceMenu?: boolean;
};

export function DataTableRowActions<T>({
  row,
  label,
  actions,
  disabled = false,
  forceMenu = false,
}: DataTableRowActionsProps<T>) {
  const { t } = useLostTranslation();
  if (actions.length === 0) return null;

  if (forceMenu || actions.length > 2) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            aria-label={t("dataTable.actionsFor", { row: label })}
          >
            <MoreHorizontal aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action) => (
            <DropdownMenuItem
              key={action.id}
              disabled={Boolean(action.disabled) || Boolean(action.disabledReason)}
              title={action.disabledReason ?? undefined}
              onSelect={() => action.onSelect(row)}
              className={cn(action.destructive && "text-destructive focus:text-destructive")}
            >
              {action.icon && <action.icon className="size-4" aria-hidden="true" />}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex justify-end gap-1">
      {actions.map((action) => (
        <Button
          key={action.id}
          type="button"
          variant="ghost"
          size="icon"
          className={cn(action.destructive && "text-destructive hover:text-destructive")}
          disabled={disabled || action.disabled || Boolean(action.disabledReason)}
          aria-label={
            action.disabledReason
              ? `${action.label}: ${label}. ${action.disabledReason}`
              : `${action.label}: ${label}`
          }
          title={action.disabledReason ?? action.label}
          onClick={() => action.onSelect(row)}
        >
          {action.icon ? <action.icon aria-hidden="true" /> : action.label}
        </Button>
      ))}
    </div>
  );
}
