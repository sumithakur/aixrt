const fs = require('fs');

let logo = fs.readFileSync('src/components/brand/Logo.tsx', 'utf8');

// Replace Next.js Image with a standard HTML img tag to perfectly preserve the native aspect ratio
// of whatever logo the user uploads (tall or wide) without any Next.js intrinsic clipping bugs
logo = logo.replace(
  /<Image[\s\S]*?\/>/,
  `<img src={logoPath} alt="AIX Summit" className="object-contain w-full h-auto" />`
);

fs.writeFileSync('src/components/brand/Logo.tsx', logo);
