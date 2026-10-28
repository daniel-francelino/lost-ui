import { LoaderCircleIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { Button, type ButtonProps } from "../../ui/button";

/** A submit button that is disabled and shows a spinner while `busy`. */
export function SubmitButton({
  busy = false,
  className,
  children,
  ...props
}: ButtonProps & { busy?: boolean; children: ReactNode }) {
  return (
    <Button type="submit" className={cn(className)} disabled={busy || props.disabled} {...props}>
      {busy && <LoaderCircleIcon aria-hidden="true" className="animate-spin" />}
      {children}
    </Button>
  );
}
