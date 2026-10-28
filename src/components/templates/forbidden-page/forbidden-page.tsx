import { ShieldAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import type { RenderNavLink } from "../../app/app-nav";
import { Empty } from "../../data/empty";
import { HomeButton } from "../lib/home-button";

export type ForbiddenPageProps = {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Where "Back to home" goes. Without it there is no button. */
  homeHref?: string;
  renderLink?: RenderNavLink;
  className?: string;
};

/** The page for someone who has no permission to see the page, to put inside the layout of the app. */
export function ForbiddenPage({
  title,
  description,
  icon,
  homeHref,
  renderLink,
  className,
}: ForbiddenPageProps) {
  const { t } = useLostTranslation();
  return (
    <Empty
      size="xl"
      className={className}
      icon={icon ?? <ShieldAlertIcon />}
      title={title ?? t("errorPage.forbidden")}
      description={description ?? t("errorPage.forbiddenDescription")}
    >
      {homeHref && <HomeButton href={homeHref} renderLink={renderLink} />}
    </Empty>
  );
}
