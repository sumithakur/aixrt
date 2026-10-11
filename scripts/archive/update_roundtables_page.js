const fs = require('fs');
let content = fs.readFileSync('src/app/roundtables/page.tsx', 'utf8');

content = content.replace("getSiteConfig } from '@/lib/content';", "getSiteConfig, getRoundtablesDataRaw } from '@/lib/content';");
content = content.replace("const config = getSiteConfig();", "const config = getSiteConfig();\n  const rawData = getRoundtablesDataRaw();");
content = content.replace(/>Six Executive Roundtables</g, ">{rawData.hero.title}<");
content = content.replace(/>Six parallel conversations, 75 minutes, fifteen seats each. Each table owns a distinct strategic lane, ensuring focused depth without convergence into generic debate.</g, ">{rawData.hero.description}<");

fs.writeFileSync('src/app/roundtables/page.tsx', content);
