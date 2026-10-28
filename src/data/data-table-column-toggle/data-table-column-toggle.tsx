import type { ReactNode } from "react";
import { Columns3 } from "lucide-react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export type DataTableColumnToggleProps = {
  columns: { id: string; label: ReactNode }[];
  /** A column is shown unless its id is `false` here. */
  visibility: Record<string, boolean>;
  onVisibilityChange: (id: string, visible: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
};

export function DataTableColumnToggle({
  columns,
  visibility,
  onVisibilityChange,
  label,
  disabled = false,
}: DataTableColumnToggleProps) {
  const { t } = useLostTranslation();
  const shown = columns.filter((column) => visibility[column.id] !== false).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="outline" size="sm" disabled={disabled}>
          <Columns3 aria-hidden="true" />
          {label ?? t("dataTable.columns")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("dataTable.toggleColumns")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => {
          const visible = visibility[column.id] !== false;

          return (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={visible}
              // the last visible column stays, or the table would have nothing to show
              disabled={visible && shown === 1}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={(checked) => onVisibilityChange(column.id, checked === true)}
            >
              {column.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
