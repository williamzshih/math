import { Settings2 } from "lucide-react";
import { useMath } from "@/app/(math)/layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

export default function Settings() {
  const { config, setOpacity, setGridVisible } = useMath();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 right-4 z-10 cursor-pointer"
        >
          <Settings2 className="size-[1.2rem]" />
          <span className="sr-only">Toggle popover</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        <Label>Opacity: {config.opacity}</Label>
        <Slider
          value={[config.opacity]}
          onValueChange={(value) => setOpacity(value[0])}
          min={0}
          max={1}
          step={0.01}
        />
        <div className="flex gap-2">
          <Label>Grid visible:</Label>
          <Checkbox
            checked={config.gridVisible}
            onCheckedChange={setGridVisible}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
