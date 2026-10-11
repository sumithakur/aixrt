const fs = require('fs');

let programme = JSON.parse(fs.readFileSync('content/programme.json', 'utf8'));

// Filter out the item containing "Networking Dinner"
programme.items = programme.items.filter(item => !item.title.includes("Networking Dinner"));

fs.writeFileSync('content/programme.json', JSON.stringify(programme, null, 2));
