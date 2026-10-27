import { AnimatedSpan, Terminal, TerminalTypingAnimation } from "../../terminal";

export default function TerminalDemo2() {
  return (
    <Terminal>
      <TerminalTypingAnimation delay={0}>$ ls</TerminalTypingAnimation>

      <AnimatedSpan delay={800} className="text-blue-500">
        Documents Downloads Pictures
      </AnimatedSpan>

      <TerminalTypingAnimation delay={1600}>$ cd Documents</TerminalTypingAnimation>

      <TerminalTypingAnimation delay={2400}>$ pwd</TerminalTypingAnimation>

      <AnimatedSpan delay={3200} className="text-green-500">
        /home/user/Documents
      </AnimatedSpan>
    </Terminal>
  );
}
