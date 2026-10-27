import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { NoiseTexture } from "../../noise-texture";

export default function NoiseTextureDemo4() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-3 p-4">
      <Label className="text-muted-foreground" htmlFor="noise-input-demo">
        Search with texture
      </Label>
      <div className="bg-muted/30 relative overflow-hidden rounded-lg border">
        <NoiseTexture noiseOpacity={0.45} />
        <Input
          className="relative z-10 border-0 bg-transparent shadow-none focus-visible:ring-2"
          id="noise-input-demo"
          placeholder="Try typing…"
          type="search"
        />
      </div>
    </div>
  );
}
