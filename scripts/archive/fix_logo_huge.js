const fs = require('fs');
let logo = fs.readFileSync('src/components/brand/Logo.tsx', 'utf8');

// I'll make the base size a bit larger so it has better resolution natively
logo = logo.replace("md: { width: 160, height: 56 }", "md: { width: 200, height: 72 }");
logo = logo.replace("lg: { width: 200, height: 64 }", "lg: { width: 240, height: 86 }");

// And scale it massively
logo = logo.replace(/scale-\[1.8\] lg:scale-\[2.2\]/g, 'scale-[2.2] lg:scale-[2.5] lg:translate-y-1');

fs.writeFileSync('src/components/brand/Logo.tsx', logo);
