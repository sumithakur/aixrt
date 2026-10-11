const fs = require('fs');
let site = JSON.parse(fs.readFileSync('content/site.json', 'utf8'));
site.brand = {
  logo: "/brand/logo-bright.png"
};
fs.writeFileSync('content/site.json', JSON.stringify(site, null, 2));
