const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

content = content.replace(
  /              <\/div>\n              <button onClick={\(\) => saveFile\('home.json'/g,
  `              </div>\n              </div>\n              <button onClick={() => saveFile('home.json'`
);

fs.writeFileSync('src/app/admin/page.tsx', content);
