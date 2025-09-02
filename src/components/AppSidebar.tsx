import * as katex from "katex";
import { X } from "lucide-react";
import * as math from "mathjs";
import { useEffect, useRef, useState } from "react";
import { useMath } from "@/app/(math)/layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

export function AppSidebar() {
  const {
    functions,
    expression,
    setExpression,
    addFunction,
    toggleFunction,
    removeFunction,
  } = useMath();

  const ref = useRef<HTMLDivElement>(null);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      setValid(false);
      return;
    }
    if (!expression.trim()) {
      ref.current.innerHTML = "";
      setValid(false);
      return;
    }
    let latex;
    try {
      latex = math.parse(expression).toTex();
    } catch {
      ref.current.innerHTML = "";
      setValid(false);
      return;
    }
    katex.render(latex, ref.current, {
      displayMode: true,
      output: "mathml",
      throwOnError: false,
    });
    setValid(true);
  }, [expression]);

  const LaTeX = ({ latex }: { latex: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!ref.current) return;
      katex.render(latex, ref.current, {
        displayMode: true,
        output: "mathml",
        throwOnError: false,
      });
    }, [latex]);
    return <div className="flex-1 font-mono" ref={ref} />;
  };

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
              onKeyDown={(e) => e.key === "Enter" && valid && addFunction()}
            />
            <div ref={ref} />
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
                      className="size-4 rounded-full border"
                      style={{
                        backgroundColor: func.hidden
                          ? "transparent"
                          : func.color,
                        borderColor: func.color,
                      }}
                    />
                  </Button>
                  <LaTeX latex={`f(x,y)=${func.expression.toTex()}`} />
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
