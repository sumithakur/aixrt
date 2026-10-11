#!/bin/bash
sed -i '' 's/onChange={val =>/onChange={(val: any) =>/g' src/app/admin/page.tsx
sed -i '' 's/onChange={newVal =>/onChange={(newVal: any) =>/g' src/app/admin/page.tsx
sed -i '' 's/const \[files, setFiles\] = useState(\[\]);/const \[files, setFiles\] = useState<string\[\]>(\[\]);/g' src/app/admin/page.tsx
