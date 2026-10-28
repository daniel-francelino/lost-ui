import { useRef, useState } from "react";
import { CalendarIcon, XIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { FormField } from "../form-field";
import { fieldControlSize, type FieldProps } from "../lib/field-props";
import { splitFieldProps } from "../lib/split-field-props";
import { useField } from "../lib/use-field";

export type DateRangeValue = { from?: Date; to?: Date };
export type FormInputDateValue = Date | null | DateRangeValue;

export type FormInputDateProps = FieldProps<FormInputDateValue> & {
  mode?: "single" | "range";
  placeholder?: string;
  min?: Date;
  max?: Date;
  locale?: string;
  clearable?: boolean;
  numberOfMonths?: number;
  /** Adds a time of day to the date. Single mode only; the value keeps the chosen time. */
  time?: boolean;
  timeLabel?: string;
};

function isRange(value: FormInputDateValue): value is DateRangeValue {
  return typeof value === "object" && value !== null && !(value instanceof Date);
}

function isoDay(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function clockTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function FormInputDate(props: FormInputDateProps) {
  const [
    fieldProps,
    {
      mode = "single",
      placeholder = "Pick a date",
      min,
      max,
      locale,
      clearable = false,
      numberOfMonths,
      time: withTime = false,
      timeLabel = "Time",
    },
  ] = splitFieldProps<FormInputDateValue, FormInputDateProps>(props);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const field = useField<FormInputDateValue>(fieldProps, {
    fallback: mode === "range" ? {} : null,
    focus: () => triggerRef.current?.focus(),
  });
  const { controlProps, ids } = field;
  const size = fieldProps.size ?? "md";
  const [open, setOpen] = useState(false);
  const locked = Boolean(fieldProps.disabled || fieldProps.readOnly);
  const showTime = withTime && mode === "single";
  const format = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    ...(showTime ? { timeStyle: "short" as const } : {}),
  });

  const single = field.value instanceof Date ? field.value : undefined;
  const range = isRange(field.value) ? field.value : undefined;
  const label =
    mode === "single"
      ? single && format.format(single)
      : range?.from &&
        `${format.format(range.from)}${range.to ? ` – ${format.format(range.to)}` : ""}`;
  const disabledDays = [min ? { before: min } : undefined, max ? { after: max } : undefined].filter(
    (rule) => rule !== undefined,
  );
  const hasValue = mode === "single" ? Boolean(single) : Boolean(range?.from);

  const clear = () => field.setValue(mode === "range" ? {} : null);

  return (
    <FormField {...field.shellProps}>
      <div className="flex items-center gap-1">
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) controlProps.onBlur();
          }}
        >
          <PopoverTrigger asChild>
            <Button
              ref={triggerRef}
              type="button"
              variant="outline"
              id={controlProps.id}
              aria-labelledby={fieldProps.label ? `${ids.labelId} ${ids.id}-value` : undefined}
              aria-invalid={controlProps["aria-invalid"]}
              aria-describedby={controlProps["aria-describedby"]}
              disabled={locked}
              onFocus={controlProps.onFocus}
              className={cn(
                "w-full justify-start font-normal",
                fieldControlSize[size],
                !label && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="size-4" />
              <span id={`${ids.id}-value`}>{label || placeholder}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            {mode === "single" ? (
              <Calendar
                mode="single"
                selected={single}
                defaultMonth={single}
                disabled={disabledDays}
                numberOfMonths={numberOfMonths}
                onSelect={(date) => {
                  if (showTime && date) {
                    // Picking a day keeps the time already chosen, or starts at midnight.
                    const next = new Date(date);
                    if (single) next.setHours(single.getHours(), single.getMinutes(), 0, 0);
                    field.setValue(next);
                    return;
                  }
                  field.setValue(date ?? null);
                  setOpen(false);
                  controlProps.onBlur();
                }}
              />
            ) : (
              <Calendar
                mode="range"
                selected={
                  range?.from
                    ? { from: range.from, ...(range.to ? { to: range.to } : {}) }
                    : undefined
                }
                defaultMonth={range?.from}
                disabled={disabledDays}
                numberOfMonths={numberOfMonths ?? 2}
                onSelect={(next) => {
                  field.setValue({
                    ...(next?.from ? { from: next.from } : {}),
                    ...(next?.to ? { to: next.to } : {}),
                  });
                  if (next?.from && next.to) {
                    setOpen(false);
                    controlProps.onBlur();
                  }
                }}
              />
            )}
            {showTime && (
              <div className="flex items-center gap-2 border-t p-3">
                <Input
                  type="time"
                  aria-label={timeLabel}
                  disabled={!single}
                  value={single ? clockTime(single) : ""}
                  onChange={(event) => {
                    const [hours, minutes] = event.target.value.split(":").map(Number);
                    if (!single || hours === undefined || minutes === undefined) return;
                    const next = new Date(single);
                    next.setHours(hours, minutes, 0, 0);
                    field.setValue(next);
                  }}
                  className="h-8"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                    controlProps.onBlur();
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
        {clearable && hasValue && !locked && (
          <Button type="button" variant="ghost" size="icon" aria-label="Clear date" onClick={clear}>
            <XIcon />
          </Button>
        )}
      </div>
      {fieldProps.name && single && (
        <input
          type="hidden"
          name={fieldProps.name}
          value={showTime ? `${isoDay(single)}T${clockTime(single)}` : isoDay(single)}
        />
      )}
      {fieldProps.name && range?.from && (
        <input
          type="hidden"
          name={fieldProps.name}
          value={`${isoDay(range.from)}/${range.to ? isoDay(range.to) : ""}`}
        />
      )}
    </FormField>
  );
}
