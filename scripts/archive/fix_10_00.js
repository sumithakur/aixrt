const fs = require('fs');

function replaceAll(file, find, replaceStr) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(find, replaceStr);
  fs.writeFileSync(file, content);
}

replaceAll('src/app/programme/page.tsx', 
  /One intensive day, 10:00 to 16:30, followed by a networking reception to 18:00\. Designed specifically to maximize high-density executive conversation\./g, 
  "{rawData.hero.description || 'One intensive day, 14:00 to 18:00, followed by a networking reception. Designed specifically to maximize high-density executive conversation.'}");

replaceAll('src/app/programme/page.tsx', /T10:00:00\+03:00/g, 'T14:00:00+03:00');

replaceAll('src/app/venue/page.tsx', 
  /10:00 – 16:30 \(Reception to 18:00\)/g, 
  '14:00 – 18:30 (Reception to 18:30)');

replaceAll('src/app/showcase/page.tsx', 
  /arrival \(10:00–10:30\) and hosted executive lunch \(12:15–13:15\)/g, 
  'arrival (14:00–14:30) and the networking break (16:00–16:30)');

