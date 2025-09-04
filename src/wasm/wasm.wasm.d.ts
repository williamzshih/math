export interface wasmType {
  (x: number): number;
}

export interface EmscriptenModule {
  cwrap: (
    name: string,
    returnType: string,
    argTypes: string[],
  ) => (...args: unknown[]) => unknown;
}
