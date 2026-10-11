const fs = require('fs');

let programme = JSON.parse(fs.readFileSync('content/programme.json', 'utf8'));

let sessionCounter = 1;
programme.items = programme.items.map(item => {
  if (item.format === 'roundtables') {
    return { ...item, roundtableSessionId: sessionCounter++ };
  }
  return item;
});

fs.writeFileSync('content/programme.json', JSON.stringify(programme, null, 2));

let row = fs.readFileSync('src/components/content/ProgrammeRow.tsx', 'utf8');

row = row.replace(/<p className="font-display text-xs font-bold uppercase tracking-wider text-text-muted">\s*Six Concurrent Tracks \(105 Minutes\):\s*<\/p>/g,
  "{item.format === 'roundtables' && <p className=\"font-display text-xs font-bold uppercase tracking-wider text-text-muted\">Concurrent Tracks:</p>}");

// Filter roundtables
row = row.replace(/\{roundtables\.map\(\(rt\) => \(/g,
  `{roundtables.filter(rt => !item.roundtableSessionId || rt.session === item.roundtableSessionId).map((rt) => (`);

fs.writeFileSync('src/components/content/ProgrammeRow.tsx', row);
