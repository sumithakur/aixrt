const fs = require('fs');
const path = 'src/app/programme/page.tsx';
let content = fs.readFileSync(path, 'utf8');
content = content.replace(
  /const architecturalReasoning = \[[\s\S]*?\];/,
  `const architecturalReasoning = [
    {
      title: 'Two Focused Roundtable Sessions',
      desc: 'Instead of one block, the afternoon features two 90-minute roundtable sessions (75 mins discussion, 15 mins startup showcase).',
    },
    {
      title: 'Integrated Startup Showcases',
      desc: 'Startups present directly to the right people at the right moment. Each startup has 6 minutes in front of 15 executives who just spent 75 minutes on the problem it solves.',
    },
    {
      title: 'The Networking Break Unites the Room',
      desc: 'The 30-minute break between sessions brings attendees of both sessions together to network with each other and meet the startups at their booths.',
    },
    {
      title: 'No Stage Synthesis',
      desc: 'Rather than plenary read-outs, each table\\'s key observations are captured anonymously and go directly into the published AIX Roundtable Signals report.',
    },
  ];`
);
fs.writeFileSync(path, content);
