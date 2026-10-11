const fs = require('fs');

const path = 'src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldProgrammeRegex = /const condensedProgramme = \[\s*\{[\s\S]*?\];/;
const newProgramme = `const condensedProgramme = [
    {
      time: '14:00 – 14:30',
      title: 'Arrival',
      desc: 'Registration, networking coffee; startup booths open; host welcome.',
    },
    {
      time: '14:30 – 16:00',
      title: 'Roundtable Session 1',
      desc: 'Three tables in parallel: 75 minutes of discussion, then 15 minutes of startup showcase.',
      highlight: true,
    },
    {
      time: '16:00 – 16:30',
      title: 'Networking Break',
      desc: 'Attendees of both sessions network with each other and meet the startups at their booths.',
    },
    {
      time: '16:30 – 18:00',
      title: 'Roundtable Session 2',
      desc: 'Three tables in parallel: 75 minutes of discussion, then 15 minutes of startup showcase.',
      highlight: true,
    },
    {
      time: '18:00 – 18:30',
      title: 'Networking & Booths',
      desc: 'Optional close: booth visits and informal networking.',
    },
    {
      time: '19:30 – 22:00',
      title: 'Networking Dinner (Optional)',
      desc: 'By invitation, for chairs, partners and selected guests.',
    },
  ];`;

content = content.replace(oldProgrammeRegex, newProgramme);
content = content.replace(/Full 12-item timeline/, 'Full timeline');

fs.writeFileSync(path, content);
