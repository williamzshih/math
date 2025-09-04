"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { EmscriptenModule } from "@/wasm/wasm";
import Module from "@/wasm/wasm.mjs";

// type Result = ReturnType<EmscriptenModule["ccall"]>;
type Result = Float64Array;

export default function Test() {
  const [wasmModule, setWasmModule] = useState<EmscriptenModule | undefined>();
  const [, setResult] = useState<Result | undefined>();

  useEffect(() => {
    (async () => {
      const wasmModule = (await Module()) as EmscriptenModule;
      setWasmModule(wasmModule);
    })();
  }, []);

  const handleClickButton = async () => {
    if (!wasmModule) return;

    const length = 1000000;
    const arr = new Float64Array(
      Array.from({ length }, () => Math.random() * 100),
    );

    const start = performance.now();

    const ptr = wasmModule._malloc(arr.byteLength);
    wasmModule.HEAPF64.set(arr, ptr >> 3);
    const result = wasmModule.ccall(
      "wasm",
      "number",
      ["number", "number"],
      [ptr, length],
    );
    const data = wasmModule.HEAPF64.slice(
      result / Float64Array.BYTES_PER_ELEMENT,
      result / Float64Array.BYTES_PER_ELEMENT + length,
    );
    wasmModule._free(ptr);

    const end = performance.now();
    console.log(`Wasm Time: ${end - start} ms`);

    const tsStart = performance.now();
    arr.sort((a, b) => a - b);
    const tsEnd = performance.now();
    console.log(`TS Time: ${tsEnd - tsStart} ms`);

    setResult(data);
  };

  return (
    <div>
      <Button onClick={handleClickButton} disabled={!wasmModule}>
        Call wasm
      </Button>
    </div>
  );
}
