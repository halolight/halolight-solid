#!/bin/bash
set -e

# Fix readonly array issues in mocks/index.ts
sed -i.bak 's/const types = \['\''meeting'\'', '\''task'\'', '\''reminder'\'', '\''holiday'\''\] as const/const types = ['\''meeting'\'', '\''task'\'', '\''reminder'\'', '\''holiday'\'']/' src/mocks/index.ts
sed -i.bak 's/const types = \['\''word'\'', '\''excel'\'',/const types: string[] = ['\''word'\'', '\''excel'\'',/' src/mocks/index.ts
sed -i.bak 's/const types = \['\''folder'\'', '\''image'\'',/const types: string[] = ['\''folder'\'', '\''image'\'',/' src/mocks/index.ts  
sed -i.bak 's/const types = \['\''system'\'', '\''message'\'',/const types: string[] = ['\''system'\'', '\''message'\'',/' src/mocks/index.ts

echo "Type fixes applied"
