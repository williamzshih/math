#!/bin/bash

set -euo pipefail

emcc -O3 src/wasm/wasm.c -o wasm.mjs -s ENVIRONMENT=web -s SINGLE_FILE=1 -s EXPORTED_FUNCTIONS=_wasm -s EXPORTED_RUNTIME_METHODS=ccall,cwrap
mv wasm.mjs src/wasm/wasm.mjs