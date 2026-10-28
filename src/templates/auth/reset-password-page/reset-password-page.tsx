import { useRef, useState, type ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { Form } from "../../../components/forms/form";
import { FormInputPassword } from "../../../components/forms/form-input-password";
import { rules } from "../../../components/forms/rules";
import { AuthLayout, type AuthLayoutProps } from "../auth-layout";
import { FormError } from "../../lib/form-error";
import { SubmitButton } from "../../lib/submit-button";
import { useSubmit, type SubmitResult } from "../../lib/use-submit";

export type ResetPasswordPageProps = Pick<
  AuthLayoutProps,
  "logo" | "variant" | "aside" | "className"
> & {
  /** Saves the new password. Return a text to show it as the error; return nothing when it worked. */
  onSubmit: (values: { password: string }) => SubmitResult | Promise<SubmitResult>;
  title?: ReactNode;
  description?: ReactNode;
  minPasswordLength?: number;
};

/** The page the recovery link opens: a new password, typed twice. */
export function ResetPasswordPage({
  onSubmit,
  title,
  description,
  minPasswordLength = 10,
  ...layout
}: ResetPasswordPageProps) {
  const { t } = useLostTranslation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const latest = useRef(password);
  latest.current = password;
  const { busy, error, run } = useSubmit(onSubmit);

  return (
    <AuthLayout
      {...layout}
      title={title ?? t("auth.resetTitle")}
      description={description ?? t("auth.resetDescription")}
    >
      <Form className="space-y-4" noValidate onSubmit={() => void run({ password })}>
        <FormInputPassword
          name="password"
          label={t("auth.newPassword")}
          hint={t("auth.passwordHint", { count: minPasswordLength })}
          autoComplete="new-password"
          autoFocus
          required
          rules={[rules.required(), rules.minLength(minPasswordLength)]}
          value={password}
          onValueChange={setPassword}
        />
        <FormInputPassword
          name="confirmPassword"
          label={t("auth.confirmPassword")}
          autoComplete="new-password"
          required
          rules={[rules.required(), rules.matches(() => latest.current, t("auth.passwordsDiffer"))]}
          value={confirm}
          onValueChange={setConfirm}
        />
        <FormError message={error} />
        <SubmitButton busy={busy} className="w-full">
          {t("auth.resetPassword")}
        </SubmitButton>
      </Form>
    </AuthLayout>
  );
}
