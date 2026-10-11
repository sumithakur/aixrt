const fs = require('fs');

let schema = fs.readFileSync('src/lib/schemas/invitation.ts', 'utf8');

// Remove priority3Roundtable
schema = schema.replace(/priority3Roundtable: z.string\(\).min\(1, 'Please select your third choice priority.'\),\s*/g, '');

fs.writeFileSync('src/lib/schemas/invitation.ts', schema);
