const fs = require('fs');
let file = 'src/app/roundtables/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The text is probably hardcoded
content = content.replace(/The Other Four Roundtables/g, 'The Other Five Roundtables');
// or maybe it's dynamic but hardcoded to four?
// Let's just do a generic replace
content = content.replace(/Four Roundtables/gi, 'Five Roundtables');

fs.writeFileSync(file, content);
