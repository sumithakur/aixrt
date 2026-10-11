const fs = require('fs');

const files = ['roundtables', 'programme', 'partners', 'showcase', 'speakers', 'audience', 'faq'];

files.forEach(name => {
  const path = `content/${name}.json`;
  if (fs.existsSync(path)) {
    let content = JSON.parse(fs.readFileSync(path, 'utf8'));
    if (Array.isArray(content)) {
      fs.writeFileSync(path, JSON.stringify({ items: content }, null, 2));
    }
  }
});
