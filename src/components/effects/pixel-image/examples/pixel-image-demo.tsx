import { placeholderImage } from "../../../../stories/placeholder";
import { PixelImage } from "..";

export default function Home() {
  return (
    <PixelImage
      src={placeholderImage(800, 600, "Pixel image")}
      customGrid={{ rows: 4, cols: 6 }}
      grayscaleAnimation
    />
  );
}
