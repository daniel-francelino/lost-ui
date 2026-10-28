import { useEffect, useState } from "react";

const mac: Record<string, string> = {
  meta: "⌘",
  command: "⌘",
  cmd: "⌘",
  ctrl: "⌃",
  control: "⌃",
  alt: "⌥",
  option: "⌥",
  shift: "⇧",
  enter: "↵",
  return: "↵",
  backspace: "⌫",
  delete: "⌦",
  tab: "⇥",
  escape: "⎋",
  esc: "⎋",
  capslock: "⇪",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
};

const other: Record<string, string> = {
  ...mac,
  meta: "Ctrl",
  command: "Ctrl",
  cmd: "Ctrl",
  ctrl: "Ctrl",
  control: "Ctrl",
  alt: "Alt",
  option: "Alt",
  shift: "Shift",
  enter: "Enter",
  return: "Enter",
  backspace: "Backspace",
  delete: "Del",
  tab: "Tab",
  escape: "Esc",
  esc: "Esc",
  capslock: "Caps",
};

/** The text of a key on the platform: `meta` is ⌘ on a Mac and Ctrl elsewhere. Other keys are returned as they are. */
export function formatKbdKey(key: string, macOS: boolean): string {
  return (macOS ? mac : other)[key.toLowerCase()] ?? key;
}

/** Tells whether the platform is a Mac, after the first render so the server and the browser agree. */
export function useKbd() {
  const [macOS, setMacOS] = useState(false);

  useEffect(() => {
    setMacOS(/Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent));
  }, []);

  return { macOS, getKbdKey: (key: string) => formatKbdKey(key, macOS) };
}
