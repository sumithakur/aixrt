const fs = require('fs');

let header = fs.readFileSync('src/components/layout/SiteHeader.tsx', 'utf8');
header = header.replace(/py-3/g, 'py-2');
header = header.replace(/py-5/g, 'py-3');
fs.writeFileSync('src/components/layout/SiteHeader.tsx', header);

let logo = fs.readFileSync('src/components/brand/Logo.tsx', 'utf8');
logo = logo.replace("sm: { width: 240, height: 80 }", "sm: { width: 140, height: 48 }");
logo = logo.replace("md: { width: 260, height: 86 }", "md: { width: 160, height: 56 }");
logo = logo.replace("lg: { width: 320, height: 106 }", "lg: { width: 200, height: 64 }");

logo = logo.replace(/scale-125 lg:scale-150/g, 'scale-[1.8] lg:scale-[2.2] translate-x-4');
fs.writeFileSync('src/components/brand/Logo.tsx', logo);
