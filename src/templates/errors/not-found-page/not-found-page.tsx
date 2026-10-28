import { FileQuestionIcon } from "lucide-react";
import type { ReactNode } from "react";

import { useLostTranslation } from "../../../i18n/use-lost-translation";
import type { RenderNavLink } from "../../../components/app/app-nav";
import { Empty } from "../../../components/data/empty";
import { HomeButton } from "../../lib/home-button";

export type NotFoundPageProps = {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  /** Where "Back to home" goes. Without it there is no button. */
  homeHref?: string;
  renderLink?: RenderNavLink;
  className?: string;
};

/** The page for an address that does not exist, to put inside the layout of the app. */
export function NotFoundPage({
  title,
  description,
  icon,
  homeHref,
  renderLink,
  className,
}: NotFoundPageProps) {
  const { t } = useLostTranslation();
  return (
    <Empty
      size="xl"
      className={className}
      icon={icon ?? <FileQuestionIcon />}
      title={title ?? t("errorPage.notFound")}
      description={description ?? t("errorPage.notFoundDescription")}
    >
      {homeHref && <HomeButton href={homeHref} renderLink={renderLink} />}
    </Empty>
  );
}
