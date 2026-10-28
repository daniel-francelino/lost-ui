import { MailCheckIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import type { RenderNavLink } from "../../components/app/app-nav";
import { PageTransition } from "../../components/elements/page-transition";
import { Form } from "../../components/forms/form";
import { FormInput } from "../../components/forms/form-input";
import { rules } from "../../components/forms/rules";
import { AuthLayout, type AuthLayoutProps } from "../auth-layout";
import { FormError } from "../lib/form-error";
import { SubmitButton } from "../lib/submit-button";
import { TemplateLink } from "../lib/template-link";
import { useSubmit, type SubmitResult } from "../lib/use-submit";

export type ForgotPasswordPageProps = Pick<
  AuthLayoutProps,
  "logo" | "variant" | "aside" | "className"
> & {
  /** Sends the link. Return a text to show it as the error; return nothing when it was sent. */
  onSubmit: (values: { email: string }) => SubmitResult | Promise<SubmitResult>;
  title?: ReactNode;
  description?: ReactNode;
  /** Where "Back to sign in" goes. */
  loginHref?: string;
  renderLink?: RenderNavLink;
};

/** Asks for the email and, once the link is sent, tells the user to check the inbox. */
export function ForgotPasswordPage({
  onSubmit,
  title,
  description,
  loginHref,
  renderLink,
  ...layout
}: ForgotPasswordPageProps) {
  const { t } = useLostTranslation();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { busy, error, run } = useSubmit(onSubmit);

  const back = loginHref && (
    <TemplateLink href={loginHref} renderLink={renderLink} className="text-primary">
      {t("auth.backToSignIn")}
    </TemplateLink>
  );

  return (
    <AuthLayout
      {...layout}
      title={sent ? t("auth.linkSentTitle") : (title ?? t("auth.forgotTitle"))}
      description={
        sent ? t("auth.linkSentDescription") : (description ?? t("auth.forgotDescription"))
      }
      footer={back}
    >
      <PageTransition transitionKey={sent ? "sent" : "form"} variant="fade">
        {sent ? (
          <MailCheckIcon aria-hidden="true" className="mx-auto size-10 text-muted-foreground" />
        ) : (
          <Form
            className="space-y-4"
            noValidate
            onSubmit={() => void run({ email }).then((ok) => ok && setSent(true))}
          >
            <FormInput
              name="email"
              label={t("auth.email")}
              type="email"
              autoComplete="email"
              autoFocus
              required
              rules={[rules.required(), rules.email()]}
              value={email}
              onValueChange={setEmail}
            />
            <FormError message={error} />
            <SubmitButton busy={busy} className="w-full">
              {t("auth.sendLink")}
            </SubmitButton>
          </Form>
        )}
      </PageTransition>
    </AuthLayout>
  );
}
