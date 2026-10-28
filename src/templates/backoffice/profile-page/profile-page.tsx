import { useRef, useState, type ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { cn } from "../../../lib/cn";
import { PageHeader } from "../../../components/app/page-header";
import { Form } from "../../../components/forms/form";
import { FormInput } from "../../../components/forms/form-input";
import { FormInputPassword } from "../../../components/forms/form-input-password";
import { rules } from "../../../components/forms/rules";
import { FormError } from "../../lib/form-error";
import { SubmitButton } from "../../lib/submit-button";
import { useSubmit, type SubmitResult } from "../../lib/use-submit";
import { SettingsSection } from "../../../components/app/settings-section";

export type ProfilePageProps = {
  /** The name now. */
  name: string;
  /** Shown under the title, e.g. `@ada · ada@acme.com · Owner`. */
  description?: ReactNode;
  /** Saves the name. Return a text to show it as the error; return nothing when it worked. */
  onSaveName: (name: string) => SubmitResult | Promise<SubmitResult>;
  /** Changes the password. Leave out to hide the section (e.g. sign in with Google). */
  onChangePassword?: (values: { password: string }) => SubmitResult | Promise<SubmitResult>;
  minPasswordLength?: number;
  /** More sections under the forms, e.g. `NotificationPreferences` in a `SettingsSection`. */
  children?: ReactNode;
  title?: ReactNode;
  className?: string;
};

function Saved({ show }: { show: boolean }) {
  const { t } = useLostTranslation();
  return (
    <span role="status" className="text-sm text-muted-foreground">
      {show ? t("settingsPage.saved") : ""}
    </span>
  );
}

/** The page of the signed in user: change the name and the password, plus the sections the app adds. */
export function ProfilePage({
  name: savedName,
  description,
  onSaveName,
  onChangePassword,
  minPasswordLength = 10,
  children,
  title,
  className,
}: ProfilePageProps) {
  const { t } = useLostTranslation();
  const [name, setName] = useState(savedName);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [nameSaved, setNameSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const latest = useRef(password);
  latest.current = password;

  const nameSubmit = useSubmit(onSaveName);
  const passwordSubmit = useSubmit(onChangePassword);

  return (
    <div data-slot="profile-page" className={cn("mx-auto w-full max-w-lg space-y-8", className)}>
      <PageHeader title={title ?? t("settingsPage.profileTitle")} description={description} />

      <Form
        noValidate
        onSubmit={() =>
          void nameSubmit.run(name.trim()).then((ok) => {
            setNameSaved(ok);
            setPasswordSaved(false);
          })
        }
      >
        <SettingsSection
          title={t("settingsPage.name")}
          footer={
            <>
              <SubmitButton busy={nameSubmit.busy} disabled={name.trim() === savedName}>
                {t("settingsPage.saveName")}
              </SubmitButton>
              <Saved show={nameSaved && name.trim() === savedName} />
            </>
          }
        >
          <FormInput
            name="name"
            label={t("settingsPage.name")}
            autoComplete="name"
            required
            rules={[rules.required(), rules.minLength(2), rules.maxLength(80)]}
            value={name}
            onValueChange={(value) => {
              setName(value);
              setNameSaved(false);
            }}
          />
          <FormError message={nameSubmit.error} />
        </SettingsSection>
      </Form>

      {onChangePassword && (
        <Form
          noValidate
          onSubmit={() =>
            void passwordSubmit.run({ password }).then((ok) => {
              setPasswordSaved(ok);
              if (ok) {
                setPassword("");
                setConfirm("");
              }
            })
          }
        >
          <SettingsSection
            title={t("settingsPage.passwordTitle")}
            footer={
              <>
                <SubmitButton busy={passwordSubmit.busy}>
                  {t("settingsPage.changePassword")}
                </SubmitButton>
                <Saved show={passwordSaved} />
              </>
            }
          >
            <FormInputPassword
              name="password"
              label={t("auth.newPassword")}
              hint={t("auth.passwordHint", { count: minPasswordLength })}
              autoComplete="new-password"
              required
              rules={[rules.required(), rules.minLength(minPasswordLength)]}
              value={password}
              onValueChange={(value) => {
                setPassword(value);
                setPasswordSaved(false);
              }}
            />
            <FormInputPassword
              name="confirmPassword"
              label={t("auth.confirmPassword")}
              autoComplete="new-password"
              required
              rules={[
                rules.required(),
                rules.matches(() => latest.current, t("auth.passwordsDiffer")),
              ]}
              value={confirm}
              onValueChange={setConfirm}
            />
            <FormError message={passwordSubmit.error} />
          </SettingsSection>
        </Form>
      )}

      {children}
    </div>
  );
}
