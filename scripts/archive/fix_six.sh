#!/bin/bash

function replace_in_file() {
    file=$1
    if [ -f "$file" ]; then
        sed -i '' 's/five/six/g' "$file"
        sed -i '' 's/Five/Six/g' "$file"
        sed -i '' 's/105-minute/75-minute/g' "$file"
        sed -i '' 's/105 minutes/75 minutes/g' "$file"
        sed -i '' 's/10:00–16:30/14:00–18:00/g' "$file"
    fi
}

replace_in_file "src/app/request-an-invitation/received/page.tsx"
replace_in_file "src/app/programme/page.tsx"
replace_in_file "src/app/signals/page.tsx"
replace_in_file "src/app/about/page.tsx"
replace_in_file "src/app/partners/become-a-partner/page.tsx"
replace_in_file "src/app/partners/page.tsx"
replace_in_file "src/app/layout.tsx"
replace_in_file "src/app/api/calendar.ics/route.ts"
replace_in_file "src/app/showcase/page.tsx"
replace_in_file "src/app/legal/confidentiality/page.tsx"
replace_in_file "src/app/page.tsx"
replace_in_file "src/app/roundtables/page.tsx"
replace_in_file "src/components/layout/SiteFooter.tsx"
replace_in_file "src/components/layout/MegaMenu.tsx"
replace_in_file "src/components/content/CTABand.tsx"
replace_in_file "src/components/content/ProgrammeRow.tsx"
