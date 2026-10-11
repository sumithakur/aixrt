const fs = require('fs');

const showcase = {
  hero: {
    title: "Enterprise AI Showcase",
    description: "Twelve heavily-vetted Series A+ enterprise AI startups present live, working software directly to the roundtable executives."
  },
  opportunity: {
    title: "Six Minutes to Prove It Works",
    paragraphs: [
      "The Showcase is strictly for enterprise-grade AI applications with verified deployments. Foundational models are table stakes; we are interested in applied layers, orchestration, security, and measurable ROI.",
      "Startups are integrated directly into the roundtable sessions. Each table (15 executives) will receive two 6-minute live demonstrations relevant to their specific lane.",
      "Showcase stations are active in the central summit foyer during arrival (14:00–14:30) and the networking break (16:00–16:30). Delegates can interact directly with the software and interrogate technical principals."
    ]
  },
  criteria: [
    { title: "Enterprise Grade", desc: "Demonstrable SOC2/ISO compliance or pathway. Built for institutional data." },
    { title: "Live Software Only", desc: "No slide decks on stage. Demos must be live, working software." },
    { title: "Verifiable ROI", desc: "Clear metrics on how the application improves margins, security, or capability." }
  ]
};
fs.writeFileSync('content/showcase.json', JSON.stringify(showcase, null, 2));

const venue = {
  hero: {
    title: "Venue & Logistics",
    description: "AIX Summit 2026 takes place in Doha, Qatar. Due to the Chatham House Rule and the seniority of the room, the specific venue is strictly embargoed until delegate confirmation."
  },
  details: {
    title: "Logistics",
    date: "Monday 14 December 2026",
    time: "14:00 – 18:30 (Reception to 18:30)",
    location: "Doha, Qatar (Embargoed)"
  }
};
fs.writeFileSync('content/venue.json', JSON.stringify(venue, null, 2));

const signals = {
  hero: {
    title: "AIX Roundtable Signals",
    description: "The official intelligence report from the AIX Summit."
  },
  content: {
    title: "The Output",
    paragraphs: [
      "Mass conferences produce soundbites. AIX Summit produces the Roundtable Signals report.",
      "Under the Chatham House Rule, participants can share the information received, but neither the identity nor the affiliation of the speaker(s). This allows us to publish the most critical insights, bottlenecks, and strategies discussed across the six lanes.",
      "The report is circulated to all attendees and chairs post-summit."
    ]
  }
};
fs.writeFileSync('content/signals.json', JSON.stringify(signals, null, 2));

const contact = {
  hero: {
    title: "Contact the Organising Team",
    description: "Direct lines to the team managing AIX Summit 2026."
  },
  emails: [
    { name: "General Enquiries", address: "hello@aix-summit.com" },
    { name: "Partnership & Chairs", address: "partners@aix-summit.com" },
    { name: "Press & Media", address: "press@aix-summit.com" }
  ]
};
fs.writeFileSync('content/contact.json', JSON.stringify(contact, null, 2));
