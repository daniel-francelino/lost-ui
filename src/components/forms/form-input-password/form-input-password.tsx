import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import { FormInput, type FormInputProps } from "../form-input";

export type FormInputPasswordProps = Omit<
  FormInputProps,
  "type" | "trailing" | "mask" | "maskTokens" | "unmask"
>;

/** A password input with a button that shows or hides what is typed. */
export function FormInputPassword({
  autoComplete = "current-password",
  ...props
}: FormInputPasswordProps) {
  const { t } = useLostTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <FormInput
      {...props}
      autoComplete={autoComplete}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          aria-label={visible ? t("formPassword.hide") : t("formPassword.show")}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="pointer-events-auto text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      }
    />
  );
}
