const fs = require('fs');
let page = fs.readFileSync('src/app/page.tsx', 'utf8');

page = page.replace(
  /className="object-cover object-center"\n\s*\/>\n\s*<\/div>\n\s*<\/div>/,
  `className="object-cover object-center"\n            />\n          </div>`
);

fs.writeFileSync('src/app/page.tsx', page);
