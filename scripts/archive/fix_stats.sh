#!/bin/bash
sed -i '' 's/>\s*75\s*</>{config.event.seats}</' src/app/page.tsx
sed -i '' 's/>\s*5\s*</>{config.event.roundtablesCount}</' src/app/page.tsx
sed -i '' 's/>\s*4–6\s*</>{config.event.showcaseCount}</' src/app/page.tsx
