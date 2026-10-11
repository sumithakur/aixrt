#!/bin/bash
sed -i '' 's/<button/<Link href="\/partners"/g' src/components/layout/SiteHeader.tsx
sed -i '' 's/<\/button>/<\/Link>/g' src/components/layout/SiteHeader.tsx
sed -i '' 's/type="button"//g' src/components/layout/SiteHeader.tsx
