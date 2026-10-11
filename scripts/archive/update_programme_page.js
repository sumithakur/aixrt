const fs = require('fs');
let content = fs.readFileSync('src/app/programme/page.tsx', 'utf8');

content = content.replace("getProgramme, getSiteConfig, getRoundtables", "getProgramme, getSiteConfig, getRoundtables, getProgrammeDataRaw");
content = content.replace("const roundtables = getRoundtables();", "const roundtables = getRoundtables();\n  const rawData = getProgrammeDataRaw();\n  const architecturalReasoning = rawData.architecturalReasoning;");
content = content.replace(/const architecturalReasoning = \[[\s\S]*?\];/g, "");
content = content.replace(/>One Day. Six Executive Conversations. No Time Wasted.</g, ">{rawData.hero.title}<");
content = content.replace(/>AIX Summit replaces the traditional multi-day, multi-track conference with a single, highly compressed schedule. The entire architecture of the day is designed to get the right people into closed-door rooms as quickly as possible, facilitate substantive exchange, and get them back to running their enterprises.</g, ">{rawData.hero.description}<");

fs.writeFileSync('src/app/programme/page.tsx', content);
