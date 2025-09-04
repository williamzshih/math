"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmscriptenModule } from "@/wasm/wasm";
import Module from "@/wasm/wasm.mjs";

export default function Test() {
  const [wasmModule, setWasmModule] = useState<EmscriptenModule | undefined>();
  const [result, setResult] = useState<
    ReturnType<EmscriptenModule["ccall"]> | undefined
  >();

  useEffect(() => {
    (async () => {
      const wasmModule = (await Module()) as EmscriptenModule;
      setWasmModule(wasmModule);
    })();
  }, []);

  const handleClickButton = async () => {
    if (!wasmModule) return;
    const start = performance.now();

    const length = 100;
    const arr = new Float64Array(
      Array.from({ length }, () => Math.random() * 100),
    );
    const ptr = wasmModule._malloc(arr.byteLength);
    wasmModule.HEAPF64.set(arr, ptr >> 3);
    const result = wasmModule.ccall(
      "wasm",
      "number",
      ["number", "number"],
      [ptr, length],
    );

    setResult(result);
    wasmModule._free(ptr);

    const end = performance.now();
    console.log(`Time: ${end - start} ms`);
  };

  return (
    <div>
      <Button onClick={handleClickButton} disabled={!wasmModule}>
        Call wasm
      </Button>
      {result !== undefined && <p>Result: {result}</p>}
    </div>
  );
}
