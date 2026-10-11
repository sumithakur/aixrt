const fs = require('fs');
let content = JSON.parse(fs.readFileSync('content/roundtables.json', 'utf8'));

content.items = content.items.map((rt, index) => {
  return {
    ...rt,
    session: index < 3 ? 1 : 2
  };
});

fs.writeFileSync('content/roundtables.json', JSON.stringify(content, null, 2));
