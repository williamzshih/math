"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Module from "@/wasm/wasm.mjs";
import { wasmType, EmscriptenModule } from "@/wasm/wasm.wasm";

export default function Test() {
  const [wasm, setWasm] = useState<wasmType | undefined>();
  const [result, setResult] = useState<number | undefined>();

  useEffect(() => {
    (async () => {
      const wasmModule = (await Module()) as EmscriptenModule;
      const wasm = wasmModule.cwrap("wasm", "number", ["number"]) as wasmType;
      setWasm(() => wasm);
    })();
  }, []);

  const handleClickButton = () => {
    if (!wasm) return;
    const start = performance.now();

    const result = wasm(Math.random() * 100);
    setResult(result);

    const end = performance.now();
    console.log(`Time: ${end - start} ms`);
  };

  return (
    <div>
      <Button onClick={handleClickButton} disabled={!wasm}>
        Call wasm
      </Button>
      {result !== undefined && <p>Result: {result}</p>}
    </div>
  );
}
