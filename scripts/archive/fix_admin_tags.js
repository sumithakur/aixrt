const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

content = content.replace(
  /<button onClick={\(\) => saveFile\('home\.json', homeData\)}/,
  `<button onClick={() => saveFile('home.json', homeData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Home Page</button>
            </div>
          )}`
);

// Wait, I replaced `...<button onClick={() => saveFile('home.json', homeData)}` with `...<button onClick={() => saveFile('home.json', homeData)}` in the regex?
// No, let me check what I actually wrote in `fix_admin_home.js`:
// `              <button onClick={() => saveFile('home.json', homeData)}`;`
// Yes, I stripped the end of the button and the `</div> )}` !

content = content.replace(
  /              <button onClick={\(\) => saveFile\('home.json', homeData\)}[\s\S]*?\{activeTab === 'about' && \(/,
  `              <button onClick={() => saveFile('home.json', homeData)} className="px-6 py-3 bg-brand-primary text-text-primary rounded font-bold shadow-glow">Save Home Page</button>
            </div>
          )}

          {activeTab === 'about' && (`
);

fs.writeFileSync('src/app/admin/page.tsx', content);
