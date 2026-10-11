const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Regex to remove the Networking Dinner object from condensedProgramme
content = content.replace(/\{\s*time:\s*'19:30 – 22:00',\s*title:\s*'Networking Dinner \(Optional\)',\s*desc:.*?\s*\},?/s, '');

fs.writeFileSync('src/app/page.tsx', content);
