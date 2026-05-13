#!/bin/bash
export PATH="/Users/mihirkanzariya/.nvm/versions/node/v24.13.1/bin:$PATH"
cd /Users/mihirkanzariya/career-ops
echo "=== Career-Ops Scan: $(date) ==="
node scan.mjs 2>&1
echo "=== Scan Complete: $(date) ==="
