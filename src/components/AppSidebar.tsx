import { X } from "lucide-react";
import { useMath } from "@/app/math/layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const {
    functions,
    config,
    expression,
    setExpression,
    addFunction,
    toggleFunction,
    removeFunction,
    setGridSize,
  } = useMath();

  return (
    <Sidebar variant="floating">
      <SidebarContent className="p-2">
        <Card>
          <CardHeader>
            <CardTitle>Add function</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label htmlFor="expression">Expression:</Label>
            <Input
              id="expression"
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., x^2 + sin(x)"
              onKeyDown={(e) => e.key === "Enter" && addFunction()}
            />
            <Label>Grid size:</Label>
            <Slider
              value={[config.gridSize]}
              onValueChange={(value) => setGridSize(value[0])}
            />
            <p className="text-muted-foreground text-xs">{config.gridSize}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Functions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {functions.length > 0 ? (
              functions.map((func) => (
                <div
                  key={func.id}
                  className="bg-muted flex items-center gap-2 rounded-lg p-2"
                >
                  <Button
                    onClick={() => toggleFunction(func.id)}
                    variant="ghost"
                    className="cursor-pointer"
                  >
                    <div
                      className={cn(
                        `size-4 rounded-full border`,
                        func.hidden ? "bg-transparent" : `bg-[${func.color}]`,
                      )}
                    />
                  </Button>
                  <p className="flex-1 font-mono">{func.expression}</p>
                  <Button
                    onClick={() => removeFunction(func.id)}
                    variant="ghost"
                    className="cursor-pointer"
                  >
                    <X />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                No functions added yet
              </p>
            )}
          </CardContent>
        </Card>
      </SidebarContent>
    </Sidebar>
  );
}
