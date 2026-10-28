# Third-party notices

## Magic UI

- Source: https://github.com/magicuidesign/magicui
- Imported commit: `efe76fc5755eca1142dd4f74c1d6f0ace2887e3c`
- Files: all components of `apps/www/registry/magicui` (`src/components/effects`), plus `ui/button` and `ui/scroll-area` (`src/components/ui`)
- Licence: MIT

Local changes to the imported files:

- `"use client"` removed; `@/lib/utils` replaced by `../lib/cn`
- Animation utilities and keyframes prefixed with `lost-` (`animate-lost-marquee`, `@keyframes lost-marquee`) so they cannot override Tailwind's own `animate-pulse` and `animate-ping` or the app's keyframes
- CSS variables renamed to avoid collisions with theme tokens: `--color-1..5` is now `--rainbow-1..5`; `--radius` in `orbiting-circles` is now `--orbit-radius`
- Hard-coded colours replaced by theme tokens (`--effect-from`, `--effect-to`, `--rainbow-*`, semantic colours). Exceptions are listed in docs/magic-ui-integration.md
- `next-themes` replaced by `useIsDark` (observes the `dark` class on `<html>`); `@radix-ui/react-icons` replaced by `lucide-react`
- `terminal.tsx`: its own `TypingAnimation` is exported as `TerminalTypingAnimation` to avoid clashing with `typing-animation.tsx`

MIT License

Copyright (c) Magic UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
