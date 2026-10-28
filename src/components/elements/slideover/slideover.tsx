import { Modal, type ModalProps } from "../modal";

export type SlideoverProps = Omit<ModalProps, "fullscreen" | "scrollable">;

/** A `Modal` that slides in from an edge of the screen, the right one by default. */
export function Slideover({ side = "right", ...props }: SlideoverProps) {
  return <Modal side={side} {...props} />;
}
