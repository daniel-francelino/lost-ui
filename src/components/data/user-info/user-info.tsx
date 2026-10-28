import type { MouseEvent, ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

export type UserInfoSize = "xs" | "sm" | "md" | "lg" | "xl";

export type UserInfoChipColor =
  "primary" | "secondary" | "success" | "info" | "warning" | "destructive" | "neutral";

export type UserInfoChip = {
  color?: UserInfoChipColor;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
};

export type UserInfoAvatar = {
  src?: string;
  alt?: string;
  /** Shown while the image loads or when there is none. Defaults to the initials of the name. */
  fallback?: ReactNode;
  /** Shown when there is no image and no name to take initials from. */
  icon?: ReactNode;
};

export type UserInfoProps = {
  name?: ReactNode;
  description?: ReactNode;
  avatar?: UserInfoAvatar;
  /** A dot on the avatar, e.g. for presence. `true` uses the default colour and corner. */
  chip?: boolean | UserInfoChip;
  /** Text of the chip for screen readers, e.g. "Online". */
  chipLabel?: string;
  size?: UserInfoSize;
  orientation?: "horizontal" | "vertical";
  /** Makes the whole user a link. */
  href?: string;
  target?: string;
  rel?: string;
  /** Makes the whole user a button, or adds a click to the link. */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Replaces the avatar. */
  renderAvatar?: () => ReactNode;
  renderName?: () => ReactNode;
  renderDescription?: () => ReactNode;
  className?: string;
};

const sizes: Record<
  UserInfoSize,
  { avatar: string; name: string; description: string; gap: string; chip: string }
> = {
  xs: {
    avatar: "size-6 text-[10px]",
    name: "text-xs",
    description: "text-[11px]",
    gap: "gap-2",
    chip: "size-1.5",
  },
  sm: {
    avatar: "size-8 text-xs",
    name: "text-sm",
    description: "text-xs",
    gap: "gap-2",
    chip: "size-2",
  },
  md: {
    avatar: "size-10 text-sm",
    name: "text-sm",
    description: "text-xs",
    gap: "gap-3",
    chip: "size-2.5",
  },
  lg: {
    avatar: "size-12 text-base",
    name: "text-base",
    description: "text-sm",
    gap: "gap-3",
    chip: "size-3",
  },
  xl: {
    avatar: "size-16 text-lg",
    name: "text-lg",
    description: "text-sm",
    gap: "gap-4",
    chip: "size-3.5",
  },
};

const chipColor: Record<UserInfoChipColor, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  destructive: "bg-destructive",
  neutral: "bg-muted-foreground",
};

const chipPosition = {
  "top-right": "right-0 top-0",
  "top-left": "left-0 top-0",
  "bottom-right": "bottom-0 right-0",
  "bottom-left": "bottom-0 left-0",
} as const;

function initials(name: ReactNode): string {
  if (typeof name !== "string") return "";
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function UserInfo({
  name,
  description,
  avatar,
  chip,
  chipLabel,
  size = "md",
  orientation = "horizontal",
  href,
  target,
  rel,
  onClick,
  renderAvatar,
  renderName,
  renderDescription,
  className,
}: UserInfoProps) {
  const vertical = orientation === "vertical";
  const chipOptions: UserInfoChip | null = chip ? (chip === true ? {} : chip) : null;
  const look = sizes[size];

  const avatarNode = renderAvatar ? (
    renderAvatar()
  ) : avatar || name ? (
    <span className="relative inline-flex shrink-0">
      <Avatar className={look.avatar}>
        {avatar?.src && <AvatarImage src={avatar.src} alt={avatar.alt ?? ""} />}
        <AvatarFallback>{avatar?.fallback ?? (initials(name) || avatar?.icon)}</AvatarFallback>
      </Avatar>
      {chipOptions && (
        <span
          data-slot="user-info-chip"
          className={cn(
            "absolute rounded-full ring-2 ring-background",
            look.chip,
            chipColor[chipOptions.color ?? "primary"],
            chipPosition[chipOptions.position ?? "top-right"],
          )}
        >
          {chipLabel && <span className="sr-only">{chipLabel}</span>}
        </span>
      )}
    </span>
  ) : null;

  const nameNode = renderName ? renderName() : name;
  const descriptionNode = renderDescription ? renderDescription() : description;

  const content = (
    <>
      {avatarNode}
      {(nameNode || descriptionNode) && (
        <span className={cn("grid min-w-0", vertical && "justify-items-center")}>
          {nameNode && (
            <span data-slot="user-info-name" className={cn("truncate font-medium", look.name)}>
              {nameNode}
            </span>
          )}
          {descriptionNode && (
            <span
              data-slot="user-info-description"
              className={cn("truncate text-muted-foreground", look.description)}
            >
              {descriptionNode}
            </span>
          )}
        </span>
      )}
    </>
  );

  const classes = cn(
    "inline-flex min-w-0 items-center",
    vertical ? "flex-col text-center" : "text-left",
    look.gap,
    (href || onClick) &&
      "rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
    href && "hover:underline",
    className,
  );

  if (href) {
    return (
      <a
        data-slot="user-info"
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        onClick={onClick}
        className={classes}
      >
        {content}
      </a>
    );
  }

  if (onClick) {
    return (
      <button data-slot="user-info" type="button" onClick={onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <div data-slot="user-info" className={classes}>
      {content}
    </div>
  );
}
