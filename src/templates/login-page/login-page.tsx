import { useState, type ReactNode } from "react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import type { RenderNavLink } from "../../components/app/app-nav";
import { Form } from "../../components/forms/form";
import { FormInput } from "../../components/forms/form-input";
import { FormInputPassword } from "../../components/forms/form-input-password";
import { rules } from "../../components/forms/rules";
import { AuthLayout, type AuthLayoutProps } from "../auth-layout";
import { FormError } from "../lib/form-error";
import { SubmitButton } from "../lib/submit-button";
import { TemplateLink } from "../lib/template-link";
import { useSubmit, type SubmitResult } from "../lib/use-submit";

export type LoginValues = { identifier: string; password: string };

export type LoginPageProps = Pick<AuthLayoutProps, "logo" | "variant" | "aside" | "className"> & {
  /** Signs in. Return a text to show it as the error; return nothing when it worked. */
  onSubmit: (values: LoginValues) => SubmitResult | Promise<SubmitResult>;
  title?: ReactNode;
  description?: ReactNode;
  /** `email` asks for an email address; `text` also takes a username. */
  identifier?: "email" | "text";
  identifierLabel?: ReactNode;
  forgotPasswordHref?: string;
  /** Adds the "No account yet?" line. */
  registerHref?: string;
  registerLabel?: ReactNode;
  /** Buttons for other ways in (Google…), under the form. */
  extra?: ReactNode;
  renderLink?: RenderNavLink;
};

/** The sign in page: identifier and password with validation, the error of the server, and the links around. */
export function LoginPage({
  onSubmit,
  title,
  description,
  identifier = "text",
  identifierLabel,
  forgotPasswordHref,
  registerHref,
  registerLabel,
  extra,
  renderLink,
  ...layout
}: LoginPageProps) {
  const { t } = useLostTranslation();
  const [values, setValues] = useState<LoginValues>({ identifier: "", password: "" });
  const { busy, error, run } = useSubmit(onSubmit);
  const required = [rules.required()];

  return (
    <AuthLayout
      {...layout}
      title={title ?? t("auth.signIn")}
      description={description}
      footer={
        registerHref && (
          <>
            {t("auth.noAccount")}{" "}
            <TemplateLink href={registerHref} renderLink={renderLink} className="text-primary">
              {registerLabel ?? t("auth.requestAccess")}
            </TemplateLink>
          </>
        )
      }
    >
      <Form className="space-y-4" noValidate onSubmit={() => void run(values)}>
        <FormInput
          name="identifier"
          label={
            identifierLabel ?? (identifier === "email" ? t("auth.email") : t("auth.identifier"))
          }
          type={identifier === "email" ? "email" : "text"}
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          autoFocus
          required
          rules={required}
          value={values.identifier}
          onValueChange={(identifierValue) =>
            setValues((v) => ({ ...v, identifier: identifierValue }))
          }
        />
        <FormInputPassword
          name="password"
          label={t("auth.password")}
          required
          rules={required}
          value={values.password}
          onValueChange={(password) => setValues((v) => ({ ...v, password }))}
        />
        <FormError message={error} />
        <SubmitButton busy={busy} className="w-full">
          {t("auth.signIn")}
        </SubmitButton>
        {forgotPasswordHref && (
          <p className="text-center text-sm">
            <TemplateLink
              href={forgotPasswordHref}
              renderLink={renderLink}
              className="text-muted-foreground"
            >
              {t("auth.forgotPassword")}
            </TemplateLink>
          </p>
        )}
      </Form>
      {extra && <div className="mt-4">{extra}</div>}
    </AuthLayout>
  );
}
