const fs = require('fs');

let content = fs.readFileSync('src/app/about/page.tsx', 'utf8');

// Add getAboutContent to imports
content = content.replace("getSiteConfig } from '@/lib/content';", "getSiteConfig, getAboutContent } from '@/lib/content';");
content = content.replace("const config = getSiteConfig();", "const config = getSiteConfig();\n  const aboutData = getAboutContent();");

content = content.replace(/>A Different Kind of Summit</g, ">{aboutData.hero.eyebrow}<");
content = content.replace(/>Built for Executive Candour</g, ">{aboutData.hero.title}<");
content = content.replace(/Mass conferences produce fleeting soundbites. AIX Summit is structured to produce durable intellectual output by putting the right people in a closed room and focusing on the friction of actual deployment./g, "{aboutData.hero.description}");

content = content.replace(/>Why One Day, Six Roundtables, and a Curated Room</g, ">{aboutData.rationale.title}<");
content = content.replace(/Senior executives do not have time for multi-day passive listening. A single, focused day concentrates attention. 75 minutes is precisely calibrated: long enough to move past superficial generalities and interrogate live bottlenecks, yet short enough to maintain high engagement./g, "{aboutData.rationale.paragraphs[0]}");
content = content.replace(/The value of any summit is defined by who is not in the room. By capping attendance at ~110 and enforcing strict seniority thresholds, AIX ensures peer-level dialogue./g, "{aboutData.rationale.paragraphs[1]}");
content = content.replace(/Generic tech events focus on what AI might do in the future. AIX is strictly concerned with what AI is doing right now in secure, scaled, enterprise environments./g, "{aboutData.rationale.paragraphs[2]}");

fs.writeFileSync('src/app/about/page.tsx', content);
