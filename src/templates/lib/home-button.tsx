import { HouseIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../i18n/use-lost-translation";
import { defaultRenderLink, type RenderNavLink } from "../../components/app/app-nav";
import { Button, type ButtonProps } from "../../components/ui/button";

/** The "Back to home" button of the error pages, a link drawn with the router of the app. */
export function HomeButton({
  href,
  renderLink = defaultRenderLink,
  label,
  variant,
}: {
  href: string;
  renderLink?: RenderNavLink | undefined;
  label?: ReactNode;
  variant?: ButtonProps["variant"];
}) {
  const { t } = useLostTranslation();
  const text = label ?? t("errorPage.backHome");
  return (
    <Button asChild variant={variant}>
      {renderLink({
        item: { title: typeof text === "string" ? text : href, to: href },
        href,
        children: (
          <>
            <HouseIcon aria-hidden="true" />
            {text}
          </>
        ),
      })}
    </Button>
  );
}
