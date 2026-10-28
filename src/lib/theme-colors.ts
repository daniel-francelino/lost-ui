/** The semantic colours of the theme that the status-like components accept. */
export type ThemeColor =
  "primary" | "secondary" | "success" | "info" | "warning" | "destructive" | "neutral";

/** Filled: the colour as a background with its readable text. */
export const solidColor: Record<ThemeColor, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success text-success-foreground",
  info: "bg-info text-info-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  neutral: "bg-foreground text-background",
};

/** A light tint of the colour with the colour as text. */
export const softColor: Record<ThemeColor, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary text-secondary-foreground",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-foreground",
};

/** A border and text in the colour, with no fill. */
export const outlineColor: Record<ThemeColor, string> = {
  primary: "border border-primary text-primary",
  secondary: "border border-secondary-foreground/40 text-secondary-foreground",
  success: "border border-success text-success",
  info: "border border-info text-info",
  warning: "border border-warning text-warning",
  destructive: "border border-destructive text-destructive",
  neutral: "border border-border text-foreground",
};

/** A tint with a border in the colour. */
export const subtleColor: Record<ThemeColor, string> = {
  primary: "border border-primary/30 bg-primary/10 text-primary",
  secondary: "border border-border bg-secondary text-secondary-foreground",
  success: "border border-success/30 bg-success/10 text-success",
  info: "border border-info/30 bg-info/10 text-info",
  warning: "border border-warning/30 bg-warning/10 text-warning",
  destructive: "border border-destructive/30 bg-destructive/10 text-destructive",
  neutral: "border border-border bg-muted text-foreground",
};

/** Only the fill, for a dot or a bar. */
export const fillColor: Record<ThemeColor, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary-foreground/60",
  success: "bg-success",
  info: "bg-info",
  warning: "bg-warning",
  destructive: "bg-destructive",
  neutral: "bg-foreground",
};

export const themeColors = Object.keys(fillColor) as ThemeColor[];
