#!/bin/bash
find src -name "*.tsx" -type f -exec sed -i '' 's/pt-32/pt-48/g' {} +
find src -name "*.tsx" -type f -exec sed -i '' 's/pt-28/pt-44/g' {} +
