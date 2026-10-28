import { useRef, useState, type ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import type { RenderNavLink } from "../../app/app-nav";
import { Form } from "../../forms/form";
import { FormInput } from "../../forms/form-input";
import { FormInputPassword } from "../../forms/form-input-password";
import { rules } from "../../forms/rules";
import { AuthLayout, type AuthLayoutProps } from "../auth-layout";
import { FormError } from "../lib/form-error";
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

export type RegisterPageProps = Pick<
  AuthLayoutProps,
  "logo" | "variant" | "aside" | "className"
> & {
  /** Creates the account. Return a text to show it as the error; return nothing when it worked. */
  onSubmit: (values: RegisterValues) => SubmitResult | Promise<SubmitResult>;
  title?: ReactNode;
  description?: ReactNode;
  /** The fields asked besides the password. A field left out comes back as an empty text. */
  fields?: RegisterField[];
  minPasswordLength?: number;
  /** Adds the "Already have an account?" line. */
  loginHref?: string;
  submitLabel?: ReactNode;
  renderLink?: RenderNavLink;
};

const allFields: RegisterField[] = ["name", "username", "email"];

/** The sign up page: the fields you pick, a password with confirmation, and the error of the server. */
export function RegisterPage({
  onSubmit,
  title,
  description,
  fields = allFields,
  minPasswordLength = 10,
  loginHref,
  submitLabel,
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
      title={title ?? t("auth.createAccount")}
      description={description}
      footer={
        loginHref && (
          <>
            {t("auth.haveAccount")}{" "}
            <TemplateLink href={loginHref} renderLink={renderLink} className="text-primary">
              {t("auth.signIn")}
            </TemplateLink>
          </>
        )
      }
    >
      <Form
        className="space-y-4"
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
            required
            rules={[...required, rules.minLength(2)]}
            value={values.name}
            onValueChange={set("name")}
          />
        )}
        {fields.includes("username") && (
          <FormInput
            name="username"
            label={t("auth.username")}
            hint={t("auth.usernameHint")}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            rules={[...required, rules.pattern(/^[a-z0-9._-]{3,30}$/)]}
            value={values.username}
            onValueChange={set("username")}
          />
        )}
        {fields.includes("email") && (
          <FormInput
            name="email"
            label={t("auth.email")}
            type="email"
            autoComplete="email"
            required
            rules={[...required, rules.email()]}
            value={values.email}
            onValueChange={set("email")}
          />
        )}
        <FormInputPassword
          name="password"
          label={t("auth.password")}
          hint={t("auth.passwordHint", { count: minPasswordLength })}
          autoComplete="new-password"
          required
          rules={[...required, rules.minLength(minPasswordLength)]}
          value={values.password}
          onValueChange={set("password")}
        />
        <FormInputPassword
          name="confirmPassword"
          label={t("auth.confirmPassword")}
          autoComplete="new-password"
          required
          rules={[
            ...required,
            rules.matches(() => latest.current.password, t("auth.passwordsDiffer")),
          ]}
          value={values.confirm}
          onValueChange={set("confirm")}
        />
        <FormError message={error} />
        <SubmitButton busy={busy} className="w-full">
          {submitLabel ?? t("auth.createAccount")}
        </SubmitButton>
      </Form>
    </AuthLayout>
  );
}
