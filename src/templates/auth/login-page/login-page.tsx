import { useState, type ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import type { RenderNavLink } from "../../../components/app/app-nav";
import { Form } from "../../../components/forms/form";
import { FormInput } from "../../../components/forms/form-input";
import { FormInputPassword } from "../../../components/forms/form-input-password";
import { rules } from "../../../components/forms/rules";
import { AuthLayout, type AuthLayoutProps } from "../auth-layout";
import { FormError } from "../../lib/form-error";
import { ProviderButtons, type AuthProvider } from "../../lib/provider-buttons";
import { SubmitButton } from "../../lib/submit-button";
import { TemplateLink } from "../../lib/template-link";
import { useSubmit, type SubmitResult } from "../../lib/use-submit";

export type LoginValues = { identifier: string; password: string };

export type LoginProvider = AuthProvider;

export type LoginPageProps = Pick<
  AuthLayoutProps,
  "logo" | "variant" | "aside" | "legal" | "className"
> & {
  /** Signs in. Return a text to show it as the error; return nothing when it worked. */
  onSubmit: (values: LoginValues) => SubmitResult | Promise<SubmitResult>;
  title?: ReactNode;
  description?: ReactNode;
  /** `email` asks for an email address; `text` also takes a username. */
  identifier?: "email" | "text";
  identifierLabel?: ReactNode;
  identifierPlaceholder?: string;
  forgotPasswordHref?: string;
  /** Adds the "Don't have an account? Sign up" line. */
  registerHref?: string;
  registerLabel?: ReactNode;
  /** Other ways in, as icon buttons under "Or continue with". */
  providers?: LoginProvider[];
  renderLink?: RenderNavLink;
};

/**
 * The sign in page: a card with the form on one side and an image on the other. Welcome heading,
 * identifier and password with validation, the error of the server, other ways in, and the links.
 */
export function LoginPage({
  onSubmit,
  title,
  description,
  identifier = "text",
  identifierLabel,
  identifierPlaceholder,
  forgotPasswordHref,
  registerHref,
  registerLabel,
  providers = [],
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
      title={title ?? t("auth.welcomeBack")}
      description={description}
      footer={
        registerHref && (
          <>
            {t("auth.noAccount")}{" "}
            <TemplateLink
              href={registerHref}
              renderLink={renderLink}
              className="text-foreground underline"
            >
              {registerLabel ?? t("auth.signUp")}
            </TemplateLink>
          </>
        )
      }
    >
      <Form greedy className="grid gap-6" noValidate onSubmit={() => void run(values)}>
        <FormInput
          name="identifier"
          label={
            identifierLabel ?? (identifier === "email" ? t("auth.email") : t("auth.identifier"))
          }
          placeholder={identifierPlaceholder}
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
          hint={
            forgotPasswordHref && (
              <TemplateLink
                href={forgotPasswordHref}
                renderLink={renderLink}
                className="text-foreground"
              >
                {t("auth.forgotPassword")}
              </TemplateLink>
            )
          }
          required
          rules={required}
          value={values.password}
          onValueChange={(password) => setValues((v) => ({ ...v, password }))}
        />
        <FormError message={error} />
        <SubmitButton busy={busy} className="w-full">
          {t("auth.signIn")}
        </SubmitButton>
        <ProviderButtons providers={providers} />
      </Form>
    </AuthLayout>
  );
}
