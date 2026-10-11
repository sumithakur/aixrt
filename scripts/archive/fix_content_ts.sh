#!/bin/bash
sed -i '' 's/roundtablesData as Roundtable\[\]/(roundtablesData as any).items as Roundtable\[\]/g' src/lib/content.ts
sed -i '' 's/programmeData as ProgrammeItem\[\]/(programmeData as any).items as ProgrammeItem\[\]/g' src/lib/content.ts
sed -i '' 's/partnersData as Partner\[\]/(partnersData as any).items as Partner\[\]/g' src/lib/content.ts
sed -i '' 's/showcaseData as ShowcaseCompany\[\]/(showcaseData as any).items as ShowcaseCompany\[\]/g' src/lib/content.ts
sed -i '' 's/speakersData as Speaker\[\]/(speakersData as any).items as Speaker\[\]/g' src/lib/content.ts
