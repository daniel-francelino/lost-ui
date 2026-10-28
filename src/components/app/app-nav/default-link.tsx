import type { RenderNavLink } from "./nav-types";

/** The link used when the app does not pass `renderLink`: a plain anchor. */
export const defaultRenderLink: RenderNavLink = ({ item: _item, href, children, ...props }) => (
  <a href={href} {...props}>
    {children}
  </a>
);
