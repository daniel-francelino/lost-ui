import { Button } from "../../../ui/button";
import { CoolMode } from "..";

export default function CoolModeDemo() {
  return (
    <div className="relative justify-center">
      <CoolMode>
        <Button>Click Me!</Button>
      </CoolMode>
    </div>
  );
}
