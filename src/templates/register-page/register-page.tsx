import { useRef, useState, type ReactNode } from "react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import type { RenderNavLink } from "../../components/app/app-nav";
import { Form } from "../../components/forms/form";
import { FormInput } from "../../components/forms/form-input";
import { FormInputPassword } from "../../components/forms/form-input-password";
import { rules } from "../../components/forms/rules";
import { AuthLayout, type AuthLayoutProps } from "../auth-layout";
import { FormError } from "../lib/form-error";
import { ProviderButtons, type AuthProvider } from "../lib/provider-buttons";
import { SubmitButton } from "../lib/submit-button";
import { TemplateLink } from "../lib/template-link";
import { useSubmit, type SubmitResult } from "../lib/use-submit";

export type RegisterField = "name" | "username" | "email";

export type RegisterValues = {
  name: string;
  username: string;
  email: string;
  password: string;
};

export type RegisterProvider = AuthProvider;

export type RegisterPageProps = Pick<
  AuthLayoutProps,
  "logo" | "variant" | "aside" | "legal" | "className"
> & {
  /** Creates the account. Return a text to show it as the error; return nothing when it worked. */
  onSubmit: (values: RegisterValues) => SubmitResult | Promise<SubmitResult>;
  title?: ReactNode;
  description?: ReactNode;
  /** The fields asked besides the password. A field left out comes back as an empty text. */
  fields?: RegisterField[];
  emailPlaceholder?: string;
  /** Under the email field, e.g. "We'll use this to contact you." */
  emailHelp?: ReactNode;
  minPasswordLength?: number;
  /** Adds the "Already have an account? Sign in" line. */
  loginHref?: string;
  submitLabel?: ReactNode;
  /** Other ways to sign up, as icon buttons under "Or continue with". */
  providers?: RegisterProvider[];
  renderLink?: RenderNavLink;
};

const allFields: RegisterField[] = ["name", "username", "email"];

/**
 * The sign up page, in the same card as the sign in: the fields you pick, the password and its
 * confirmation side by side, the error of the server, other ways to sign up, and the links.
 */
export function RegisterPage({
  onSubmit,
  title,
  description,
  fields = allFields,
  emailPlaceholder,
  emailHelp,
  minPasswordLength = 10,
  loginHref,
  submitLabel,
  providers = [],
  renderLink,
  ...layout
}: RegisterPageProps) {
  const { t } = useLostTranslation();
  const [values, setValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const latest = useRef(values);
  latest.current = values;
  const { busy, error, run } = useSubmit(onSubmit);
  const set = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));
  const required = [rules.required()];

  return (
    <AuthLayout
      {...layout}
      title={title ?? t("auth.createYourAccount")}
      description={description}
      footer={
        loginHref && (
          <>
            {t("auth.haveAccount")}{" "}
            <TemplateLink
              href={loginHref}
              renderLink={renderLink}
              className="text-foreground underline"
            >
              {t("auth.signIn")}
            </TemplateLink>
          </>
        )
      }
    >
      <Form
        className="grid gap-6"
        noValidate
        onSubmit={() => {
          const { confirm: _confirm, ...account } = values;
          void run(account);
        }}
      >
        {fields.includes("name") && (
          <FormInput
            name="name"
            label={t("auth.name")}
            autoComplete="name"
            rules={[...required, rules.minLength(2)]}
            value={values.name}
            onValueChange={set("name")}
          />
        )}
        {fields.includes("username") && (
          <FormInput
            name="username"
            label={t("auth.username")}
            help={t("auth.usernameHint")}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            rules={[...required, rules.pattern(/^[a-z0-9._-]{3,30}$/)]}
            value={values.username}
            onValueChange={set("username")}
          />
        )}
        {fields.includes("email") && (
          <FormInput
            name="email"
            label={t("auth.email")}
            help={emailHelp}
            placeholder={emailPlaceholder}
            type="email"
            autoComplete="email"
            rules={[...required, rules.email()]}
            value={values.email}
            onValueChange={set("email")}
          />
        )}
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-4">
            <FormInputPassword
              name="password"
              label={t("auth.password")}
              autoComplete="new-password"
              rules={[...required, rules.minLength(minPasswordLength)]}
              value={values.password}
              onValueChange={set("password")}
            />
            <FormInputPassword
              name="confirmPassword"
              label={t("auth.confirmPassword")}
              autoComplete="new-password"
              rules={[
                ...required,
                rules.matches(() => latest.current.password, t("auth.passwordsDiffer")),
              ]}
              value={values.confirm}
              onValueChange={set("confirm")}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("auth.passwordHint", { count: minPasswordLength })}
          </p>
        </div>
        <FormError message={error} />
        <SubmitButton busy={busy} className="w-full">
          {submitLabel ?? t("auth.createAccount")}
        </SubmitButton>
        <ProviderButtons providers={providers} />
      </Form>
    </AuthLayout>
  );
}
