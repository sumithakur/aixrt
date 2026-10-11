const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');
const DENYLIST_PATH = path.join(CONTENT_DIR, '_internal-denylist.json');

console.log('--- RUNNING AIX SUMMIT 2026 CONFIRMATION GATE & CONTENT VALIDATION ---');

let errors = [];

// 1. Load denylist
if (!fs.existsSync(DENYLIST_PATH)) {
  errors.push(`Missing denylist at ${DENYLIST_PATH}`);
}
const denylist = JSON.parse(fs.readFileSync(DENYLIST_PATH, 'utf8'));

// Helper to check text against denylist
function checkTextForDenylist(text, source) {
  if (typeof text !== 'string') return;
  for (const denied of denylist) {
    if (text.toLowerCase().includes(denied.toLowerCase())) {
      errors.push(`[DENYLIST VIOLATION] Found forbidden phrase "${denied}" in ${source}: "${text.slice(0, 80)}"`);
    }
  }
}

// 2. Validate roundtables.json
const roundtablesPath = path.join(CONTENT_DIR, 'roundtables.json');
if (fs.existsSync(roundtablesPath)) {
  const roundtables = JSON.parse(fs.readFileSync(roundtablesPath, 'utf8')).items || JSON.parse(fs.readFileSync(roundtablesPath, 'utf8'));
  roundtables.forEach((rt) => {
    // Check confirmation gate for chairs
    if (rt.chair) {
      if (rt.chair.status !== 'confirmed') {
        if (rt.chair.organisation && rt.chair.organisation.trim() !== '' && rt.chair.organisation !== 'TBD' && rt.chair.organisation !== 'Pending') {
          errors.push(`[CONFIRMATION GATE FAIL] Unconfirmed chair organisation "${rt.chair.organisation}" present in roundtable "${rt.slug}" while status is "${rt.chair.status}".`);
        }
        if (rt.chair.personName && rt.chair.personName.trim() !== '' && rt.chair.personName !== 'TBD') {
          errors.push(`[CONFIRMATION GATE FAIL] Unconfirmed chair person "${rt.chair.personName}" present in roundtable "${rt.slug}" while status is "${rt.chair.status}".`);
        }
      }
    }

    // Denylist scan
    checkTextForDenylist(rt.title, `roundtables[${rt.slug}].title`);
    checkTextForDenylist(rt.coreQuestion, `roundtables[${rt.slug}].coreQuestion`);
    checkTextForDenylist(rt.lane, `roundtables[${rt.slug}].lane`);
    (rt.themes || []).forEach((t, i) => checkTextForDenylist(t, `roundtables[${rt.slug}].themes[${i}]`));
    (rt.participantProfile || []).forEach((p, i) => checkTextForDenylist(p, `roundtables[${rt.slug}].participantProfile[${i}]`));
  });
}

// 3. Validate site.json
const sitePath = path.join(CONTENT_DIR, 'site.json');
if (fs.existsSync(sitePath)) {
  const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
  if (site.venue) {
    if (site.venue.status !== 'confirmed') {
      if (site.venue.name && site.venue.name !== 'Doha, Qatar' && site.venue.name.trim() !== '') {
        errors.push(`[CONFIRMATION GATE FAIL] Unconfirmed venue name "${site.venue.name}" present in site.json while venue.status is "${site.venue.status}". Must be 'Doha, Qatar'.`);
      }
    }
  }

  const siteStr = JSON.stringify(site);
  for (const denied of denylist) {
    if (siteStr.toLowerCase().includes(denied.toLowerCase())) {
      errors.push(`[DENYLIST VIOLATION] Found forbidden phrase "${denied}" in site.json`);
    }
  }
}

// 4. Validate partners.json
const partnersPath = path.join(CONTENT_DIR, 'partners.json');
if (fs.existsSync(partnersPath)) {
  const partners = JSON.parse(fs.readFileSync(partnersPath, 'utf8')).items || JSON.parse(fs.readFileSync(partnersPath, 'utf8'));
  partners.forEach((p, i) => {
    if (p.status && p.status === 'rejected' && p.name && p.name.trim() !== '') {
      errors.push(`[CONFIRMATION GATE FAIL] Rejected partner name "${p.name}" present in partners[${i}].`);
    }
  });
}

// 5. Validate speakers.json
const speakersPath = path.join(CONTENT_DIR, 'speakers.json');
if (fs.existsSync(speakersPath)) {
  const speakers = JSON.parse(fs.readFileSync(speakersPath, 'utf8')).items || JSON.parse(fs.readFileSync(speakersPath, 'utf8'));
  speakers.forEach((s, i) => {
    if (s.status !== 'confirmed' && s.name && s.name.trim() !== '') {
      errors.push(`[CONFIRMATION GATE FAIL] Unconfirmed speaker name "${s.name}" present in speakers[${i}] while status is "${s.status}".`);
    }
  });
}

// 6. Validate showcase.json
const showcasePath = path.join(CONTENT_DIR, 'showcase.json');
if (fs.existsSync(showcasePath)) {
  const showcase = JSON.parse(fs.readFileSync(showcasePath, 'utf8')).items || JSON.parse(fs.readFileSync(showcasePath, 'utf8'));
  showcase.forEach((sc, i) => {
    if (sc.status !== 'confirmed' && sc.name && sc.name.trim() !== '') {
      errors.push(`[CONFIRMATION GATE FAIL] Unconfirmed showcase company name "${sc.name}" present in showcase[${i}] while status is "${sc.status}".`);
    }
  });
}

if (errors.length > 0) {
  console.error('\n❌ VALIDATION FAILED WITH THE FOLLOWING ERRORS:');
  errors.forEach((err, idx) => console.error(`  ${idx + 1}. ${err}`));
  console.error('\nBuild blocked. Fix the violations above before proceeding.');
  process.exit(1);
} else {
  console.log('✅ ALL CONFIRMATION GATE & DENYLIST CHECKS PASSED!');
  process.exit(0);
}
