const fs = require('fs');
let logo = fs.readFileSync('src/components/brand/Logo.tsx', 'utf8');

logo = logo.replace(
  /className="object-contain scale-\[4\.5\] lg:scale-\[5\] origin-left translate-x-4"/,
  'className="object-contain"'
);

fs.writeFileSync('src/components/brand/Logo.tsx', logo);
