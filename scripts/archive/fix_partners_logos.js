const fs = require('fs');
let partners = JSON.parse(fs.readFileSync('content/partners.json', 'utf8'));
partners.items = partners.items.map(p => ({ ...p, logo: '' }));
fs.writeFileSync('content/partners.json', JSON.stringify(partners, null, 2));
