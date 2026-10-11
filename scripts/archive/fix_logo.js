const fs = require('fs');
let logo = fs.readFileSync('src/components/brand/Logo.tsx', 'utf8');

logo = logo.replace(
  /className="object-contain" style=\{\{ width: dimensions.width, height: dimensions.height \}\}/,
  'className="object-contain scale-[4.5] lg:scale-[5] origin-left translate-x-4" style={{ width: dimensions.width, height: dimensions.height }}'
);

fs.writeFileSync('src/components/brand/Logo.tsx', logo);
