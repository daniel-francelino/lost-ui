import type { ReactNode } from "react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { Button } from "../../components/ui/button";

/** One of the other ways to sign in or sign up (Google, Apple…), drawn as an icon button. */
export type AuthProvider = {
  id: string;
  /** The name of the provider, read by screen readers ("Continue with Google"). */
  label: string;
  icon: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

/** "Or continue with" and a row of icon buttons, one per provider. Nothing without providers. */
export function ProviderButtons({ providers }: { providers: AuthProvider[] }) {
  const { t } = useLostTranslation();
  if (providers.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        {t("auth.orContinueWith")}
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      <div className="grid auto-cols-fr grid-flow-col gap-4">
        {providers.map((provider) => (
          <Button
            key={provider.id}
            type="button"
            variant="outline"
            disabled={provider.disabled}
            aria-label={t("auth.continueWith", { provider: provider.label })}
            onClick={provider.onClick}
          >
            {provider.icon}
          </Button>
        ))}
      </div>
    </>
  );
}
