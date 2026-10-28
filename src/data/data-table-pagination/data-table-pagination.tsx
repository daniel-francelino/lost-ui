import { ChevronLeft, ChevronRight } from "lucide-react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { cn } from "../../lib/cn";
import { Button } from "../../ui/button";

export type DataTablePaginationProps = {
  /** 1-based. */
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** With this and `pageSizeOptions` the bar lets the user pick how many rows a page has. */
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  disabled?: boolean;
  className?: string;
};

export function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  disabled = false,
  className,
}: DataTablePaginationProps) {
  const { t } = useLostTranslation();
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <nav
      aria-label={t("dataTable.pagination")}
      data-slot="data-table-pagination"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground",
        className,
      )}
    >
      <p aria-live="polite">
        {total === 0 ? t("dataTable.noRecords") : t("dataTable.showing", { from, to, total })}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {onPageSizeChange && pageSizeOptions && pageSizeOptions.length > 0 && (
          <label className="flex items-center gap-2">
            {t("dataTable.rowsPerPage")}
            <select
              value={pageSize}
              disabled={disabled}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              className="h-8 rounded-md border border-input bg-transparent px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          {t("dataTable.previous")}
        </Button>
        <span aria-current="page">{t("dataTable.page", { page, pages })}</span>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || page >= pages}
          onClick={() => onPageChange(page + 1)}
        >
          {t("dataTable.next")}
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
