const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

console.log('--- RUNNING HEX CHECK GUARD (NO HARDCODED HEX VALUES IN SRC) ---');

if (!fs.existsSync(SRC_DIR)) {
  console.log('src directory does not exist yet. Passing check.');
  process.exit(0);
}

function scanDir(dir) {
  let files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanDir(fullPath));
    } else if (entry.isFile() && /\.(tsx|ts|js|jsx|css)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = scanDir(SRC_DIR);
let violations = [];
const hexRegex = /#[0-9a-fA-F]{6}\b/g;

for (const file of allFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(hexRegex);
  if (matches) {
    violations.push({
      file: path.relative(path.join(__dirname, '..'), file),
      matches: [...new Set(matches)]
    });
  }
}

if (violations.length > 0) {
  console.error('\n❌ HARD RULE VIOLATION: Hardcoded hex codes found in src/:');
  violations.forEach(v => {
    console.error(`  - ${v.file}: ${v.matches.join(', ')}`);
  });
  console.error('\nAll colors must flow from design/tokens.json via Tailwind classes or CSS variables.');
  process.exit(1);
} else {
  console.log(`✅ Passed: Checked ${allFiles.length} source files, 0 hardcoded hex codes found.`);
  process.exit(0);
}
