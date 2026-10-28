export type MaskToken = {
  /** A typed character that fits this slot. */
  pattern: RegExp;
  /** Changes the accepted character, e.g. to upper case. */
  transform?: (char: string) => string;
};

export type MaskTokens = Record<string, MaskToken>;

/**
 * The slots a mask can hold, after Quasar's `QInput`:
 * `#` digit, `S` letter, `N` letter or digit, `A`/`a` letter in upper/lower case,
 * `X`/`x` letter or digit in upper/lower case. Any other character is a literal;
 * put `\` before a token character to use it as a literal.
 */
export const defaultMaskTokens: MaskTokens = {
  "#": { pattern: /\d/ },
  S: { pattern: /\p{L}/u },
  N: { pattern: /[\p{L}\p{N}]/u },
  A: { pattern: /\p{L}/u, transform: (char) => char.toUpperCase() },
  a: { pattern: /\p{L}/u, transform: (char) => char.toLowerCase() },
  X: { pattern: /[\p{L}\p{N}]/u, transform: (char) => char.toUpperCase() },
  x: { pattern: /[\p{L}\p{N}]/u, transform: (char) => char.toLowerCase() },
};

type Slot = { token: MaskToken } | { literal: string };

type Compiled = { slots: Slot[]; capacity: number };

export type MaskResult = {
  /** The input shaped by the mask. */
  text: string;
  /** Only the characters that went into token slots, without the literals. */
  raw: string;
  /** How many literal characters close `text`, after the last typed character. */
  trailing: number;
};

function compile(mask: string, tokens: MaskTokens): Compiled {
  const slots: Slot[] = [];

  for (let index = 0; index < mask.length; index++) {
    const char = mask.charAt(index);
    const token = tokens[char];

    if (char === "\\" && index + 1 < mask.length) {
      index++;
      slots.push({ literal: mask.charAt(index) });
    } else if (token) {
      slots.push({ token });
    } else {
      slots.push({ literal: char });
    }
  }

  return { slots, capacity: slots.filter((slot) => "token" in slot).length };
}

function fill(input: string, { slots }: Compiled): MaskResult {
  let text = "";
  let raw = "";
  let trailing = 0;
  let at = 0;

  for (const slot of slots) {
    if (at >= input.length) break;

    if ("token" in slot) {
      while (at < input.length && !slot.token.pattern.test(input.charAt(at))) at++;
      if (at >= input.length) break;

      const char = slot.token.transform ? slot.token.transform(input.charAt(at)) : input.charAt(at);
      text += char;
      raw += char;
      trailing = 0;
      at++;
    } else {
      text += slot.literal;
      trailing++;
      if (input.charAt(at) === slot.literal) at++;
    }
  }

  return { text, raw, trailing };
}

/**
 * Shapes `input` with `mask`. With several masks the shortest one that holds every
 * typed character is used, e.g. `["###.###.###-##", "##.###.###/####-##"]` for CPF or CNPJ.
 */
export function applyMask(
  input: string,
  mask: string | string[],
  tokens: MaskTokens = defaultMaskTokens,
): MaskResult {
  const masks = (Array.isArray(mask) ? mask : [mask])
    .map((item) => compile(item, tokens))
    .sort((a, b) => a.capacity - b.capacity);
  const longest = masks.at(-1);
  if (!longest) return { text: input, raw: input, trailing: 0 };
  if (masks.length === 1) return fill(input, longest);

  const { raw } = fill(input, longest);
  return fill(raw, masks.find((item) => item.capacity >= raw.length) ?? longest);
}

/** The characters of `value` that are not literals of the mask. */
export function unmaskValue(
  value: string,
  mask: string | string[],
  tokens: MaskTokens = defaultMaskTokens,
): string {
  return applyMask(value, mask, tokens).raw;
}
