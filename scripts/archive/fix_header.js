const fs = require('fs');

let header = fs.readFileSync('src/components/layout/SiteHeader.tsx', 'utf8');

// Replace Logo call with custom classes
header = header.replace(
  /<Logo size="md" \/>/,
  `<Logo size="md" className="w-[140px] sm:w-[200px] lg:w-[250px] lg:scale-125 lg:origin-left transition-all" />`
);

// We should also make sure Logo.tsx accepts and prioritizes the CSS width over the inline style.
let logo = fs.readFileSync('src/components/brand/Logo.tsx', 'utf8');

logo = logo.replace(
  /className="object-contain" style=\{\{ width: dimensions\.width, height: dimensions\.height \}\}/,
  `className="object-contain w-full h-auto" `
);

logo = logo.replace(
  /<div className="relative flex items-center">/,
  `<div className="relative flex items-center w-full">`
);

fs.writeFileSync('src/components/layout/SiteHeader.tsx', header);
fs.writeFileSync('src/components/brand/Logo.tsx', logo);
