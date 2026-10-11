const fs = require('fs');
let content = fs.readFileSync('src/app/partners/page.tsx', 'utf8');

content = content.replace("getPartners, getRoundtables", "getPartners, getRoundtables, getPartnersDataRaw");
content = content.replace("const roundtables = getRoundtables();", "const roundtables = getRoundtables();\n  const rawData = getPartnersDataRaw();");
content = content.replace(/>Partners & Roundtable Chairs</g, ">{rawData.hero.title}<");
content = content.replace(/>Partnership at AIX Summit means substantive access to a curated executive room, not exposure to a crowd. Our partners lead the strategic agenda across sovereign AI deployment, critical infrastructure, and capital investment.</g, ">{rawData.hero.description}<");

fs.writeFileSync('src/app/partners/page.tsx', content);
