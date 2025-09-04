interface wasm {
  (arr: number, len: number): number;
}

export interface EmscriptenModule {
  cwrap: (
    name: string,
    returnType: string,
    argTypes: string[],
  ) => (...args: Parameters<wasm>) => ReturnType<wasm>;
  ccall: (
    name: string,
    returnType: string,
    argTypes: string[],
    args: Parameters<wasm>,
  ) => ReturnType<wasm>;
  _malloc: (size: number) => number;
  _free: (ptr: number) => void;
  HEAP8: Int8Array;
  HEAPU8: Uint8Array;
  HEAP16: Int16Array;
  HEAPU16: Uint16Array;
  HEAP32: Int32Array;
  HEAPU32: Uint32Array;
  HEAP64: BigInt64Array;
  HEAPU64: BigUint64Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
}
