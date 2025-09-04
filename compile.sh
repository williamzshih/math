#!/bin/bash

set -euo pipefail

VALID_HEAPS=(HEAP8 HEAP16 HEAP32 HEAP64 HEAPU8 HEAPU16 HEAPU32 HEAPU64 HEAPF32 HEAPF64)
HEAPS=()
INVALID_HEAPS=()

for arg in "$@"; do
    if [[ " ${VALID_HEAPS[*]} " =~ " ${arg} " ]]; then
        HEAPS+=(${arg})
    else
        INVALID_HEAPS+=(${arg})
    fi
done

show_usage() {
    echo "Usage: $0 [HEAP_TYPE1] [HEAP_TYPE2] ..."
    echo "Valid heap types:"
    for heap in "${VALID_HEAPS[@]}"; do
        echo " - ${heap}"
    done
}

if [[ ${#INVALID_HEAPS[@]} -ne 0 ]]; then
    echo "Error: Invalid heap type(s): ${INVALID_HEAPS[@]}"
    show_usage
    exit 1
fi

EXPORTED_FUNCTIONS="_wasm"
EXPORTED_RUNTIME_METHODS="ccall,cwrap"

if [ ${#HEAPS[@]} -eq 0 ]; then
    echo "No heap types specified. Building minimal version."
else
    echo "Using heap types: ${HEAPS[@]}"
    EXPORTED_FUNCTIONS+=",_malloc,_free"
    IFS=,
    EXPORTED_RUNTIME_METHODS+=",${HEAPS[*]}"
fi

emcc -O3 src/wasm/wasm.c -o wasm.mjs \
    -s ENVIRONMENT=web \
    -s SINGLE_FILE=1 \
    -s EXPORTED_FUNCTIONS="${EXPORTED_FUNCTIONS}" \
    -s EXPORTED_RUNTIME_METHODS="${EXPORTED_RUNTIME_METHODS}"

mv wasm.mjs src/wasm/wasm.mjs