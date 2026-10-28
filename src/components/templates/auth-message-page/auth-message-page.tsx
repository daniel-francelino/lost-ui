import type { ReactNode } from "react";

import { AuthLayout, type AuthLayoutProps } from "../auth-layout";

export type AuthMessagePageProps = Pick<
  AuthLayoutProps,
  "logo" | "variant" | "aside" | "footer" | "className"
> & {
  title: ReactNode;
  description?: ReactNode;
  /** Above the text, e.g. a clock or an envelope. */
  icon?: ReactNode;
  /** Buttons, e.g. "Check again" and "Sign out". */
  actions?: ReactNode;
};

/**
 * A page of the auth frame that only says something and offers a next step: waiting for approval,
 * confirm the email, the account is suspended, the email was confirmed…
 */
export function AuthMessagePage({ icon, actions, ...layout }: AuthMessagePageProps) {
  return (
    <AuthLayout {...layout}>
      {(icon || actions) && (
        <div className="grid gap-4">
          {icon && (
            <span aria-hidden="true" className="mx-auto flex text-muted-foreground [&_svg]:size-10">
              {icon}
            </span>
          )}
          {actions && <div className="flex flex-col gap-3 sm:flex-row [&>*]:flex-1">{actions}</div>}
        </div>
      )}
    </AuthLayout>
  );
}
