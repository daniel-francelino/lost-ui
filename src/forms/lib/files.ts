/** True when `file` fits an `accept` list such as `"image/*,.pdf,application/zip"`. */
export function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;

  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean)
    .some((token) => {
      if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token);
      if (token.endsWith("/*")) return file.type.toLowerCase().startsWith(token.slice(0, -1));
      return file.type.toLowerCase() === token;
    });
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
