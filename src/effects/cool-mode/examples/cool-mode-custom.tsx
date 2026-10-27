import { Button } from "../../../ui/button";
import { CoolMode } from "../../cool-mode";

export default function CoolModeCustom() {
  return (
    <div className="relative justify-center">
      <CoolMode
        options={{
          particle: "https://avatars.githubusercontent.com/u/81306489",
        }}
      >
        <Button>Click Me!</Button>
      </CoolMode>
    </div>
  );
}
