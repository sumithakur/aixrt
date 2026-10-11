const fs = require('fs');

let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Add getHomeContent to imports
content = content.replace("getSiteConfig, getRoundtables, getAudienceData", "getSiteConfig, getRoundtables, getAudienceData, getHomeContent");
content = content.replace("const audience = getAudienceData();", "const audience = getAudienceData();\n  const homeData = getHomeContent();");

// Replace texts
content = content.replace(/>Where AI moves from ambition to action</g, ">{homeData.hero.eyebrow}<");
content = content.replace(/>Working AI</g, ">{homeData.hero.title}<");
content = content.replace(/AIX Summit 2026 is a one-day executive summit in Doha. Around 60 senior leaders, six sponsored roundtables, and a small number of high-value stage moments — built for the people responsible for deploying, governing, funding and scaling AI./g, "{homeData.hero.description}");
content = content.replace(/&ldquo;AI has moved beyond experimentation. The harder questions now concern execution — where to deploy, how to redesign work around it, how to secure it, how to govern it, and how to turn investment into measurable value. AIX puts the people making those decisions in one room and gives them six focused conversations to work through.&rdquo;/g, "{homeData.hero.quote}");

content = content.replace(/>A Room Designed for Real Deployment Challenges</g, ">{homeData.positioning.title}<");

content = content.replace(/>No Generic Panels</g, ">{homeData.positioning.blocks[0].title}<");
content = content.replace(/>Stage time is reserved exclusively for unscripted, highly technical cross-examinations. The majority of the day happens off-stage.</g, ">{homeData.positioning.blocks[0].desc}<");

content = content.replace(/>Strictly Enterprise</g, ">{homeData.positioning.blocks[1].title}<");
content = content.replace(/>AIX is built for institutional scale. We focus on sovereign deployment, critical infrastructure, financial services, and state security.</g, ">{homeData.positioning.blocks[1].desc}<");

content = content.replace(/>Verified Case Studies</g, ">{homeData.positioning.blocks[2].title}<");
content = content.replace(/>Foundational models are only the starting point. We prioritize live demonstrations of applied, outcome-generating AI.</g, ">{homeData.positioning.blocks[2].desc}<");

content = content.replace(/>Closed-Door Candor</g, ">{homeData.positioning.blocks[3].title}<");
content = content.replace(/>Meaningful challenges cannot be discussed on a livestream. The roundtables operate strictly under the Chatham House Rule.</g, ">{homeData.positioning.blocks[3].desc}<");

content = content.replace(/>The Six Executive Roundtables</g, ">{homeData.roundtablesIntro.title}<");
content = content.replace(/Partnership at AIX Summit provides substantive access to a curated executive room, not passive brand impressions. Six Roundtable Chair partnerships are open for organisations leading AI deployments in Qatar and the GCC./g, "{homeData.roundtablesIntro.description}");

content = content.replace(/>Enterprise Startup Showcase</g, ">{homeData.showcaseIntro.title}<");
content = content.replace(/Six minutes to prove it works. Throughout the afternoon, twelve heavily-vetted Series A\+ enterprise AI startups present live, working software directly to the roundtable executives./g, "{homeData.showcaseIntro.description}");

fs.writeFileSync('src/app/page.tsx', content);
