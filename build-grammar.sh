#!/bin/bash
# Build the baked-in grammar wasm exactly like Zed does: compile grammar/src/parser.c to grammars/hubl.wasm
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
WASI=$(ls -d "$HOME/Library/Application Support/Zed/extensions/wasm-sdk"* 2>/dev/null | head -1)
echo "wasi-sdk: ${WASI:-not found}"
if [ -n "$WASI" ]; then
  "$WASI/bin/clang" -fPIC -shared -Os -Wl,--export=tree_sitter_hubl \
    -o "$DIR/grammars/hubl.wasm" -I "$DIR/grammar/src" "$DIR/grammar/src/parser.c"
else
  tree-sitter build --wasm -o "$DIR/grammars/hubl.wasm" "$DIR/grammar"
fi
ls -la "$DIR/grammars/"