const fs = require('fs');

function updateJson(filename, extraData) {
  const path = `content/${filename}.json`;
  if (fs.existsSync(path)) {
    let content = JSON.parse(fs.readFileSync(path, 'utf8'));
    content = { ...content, ...extraData };
    fs.writeFileSync(path, JSON.stringify(content, null, 2));
  }
}

updateJson('programme', {
  hero: {
    title: "One Day. Six Executive Conversations. No Time Wasted.",
    description: "AIX Summit replaces the traditional multi-day, multi-track conference with a single, highly compressed schedule. The entire architecture of the day is designed to get the right people into closed-door rooms as quickly as possible, facilitate substantive exchange, and get them back to running their enterprises."
  },
  architecturalReasoning: [
    {
      title: 'Two Focused Roundtable Sessions',
      desc: 'Instead of one block, the afternoon features two 90-minute roundtable sessions (75 mins discussion, 15 mins startup showcase).'
    },
    {
      title: 'Integrated Startup Showcases',
      desc: 'Startups present directly to the right people at the right moment. Each startup has 6 minutes in front of 15 executives who just spent 75 minutes on the problem it solves.'
    },
    {
      title: 'The Networking Break Unites the Room',
      desc: 'The 30-minute break between sessions brings attendees of both sessions together to network with each other and meet the startups at their booths.'
    },
    {
      title: 'No Stage Synthesis',
      desc: 'Rather than plenary read-outs, each table\'s key observations are captured anonymously and go directly into the published AIX Roundtable Signals report.'
    }
  ]
});

updateJson('roundtables', {
  hero: {
    title: "Six Executive Roundtables",
    description: "Six parallel conversations, 75 minutes, fifteen seats each. Each table owns a distinct strategic lane, ensuring focused depth without convergence into generic debate."
  }
});

updateJson('partners', {
  hero: {
    title: "Partners & Roundtable Chairs",
    description: "Partnership at AIX Summit means substantive access to a curated executive room, not exposure to a crowd. Our partners lead the strategic agenda across sovereign AI deployment, critical infrastructure, and capital investment."
  }
});
