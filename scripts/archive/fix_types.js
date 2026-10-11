const fs = require('fs');
let types = fs.readFileSync('src/types/content.ts', 'utf8');

if (!types.includes('roundtableSessionId')) {
  types = types.replace(/format: string;/g, "format: string;\n  roundtableSessionId?: number;");
}

fs.writeFileSync('src/types/content.ts', types);
