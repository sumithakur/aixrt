const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// The roundtables tab has this block for each roundtable:
// <div key={i} className="p-6 border border-border-subtle bg-bg-surface rounded-lg relative">
// ...
// We can just add a Session selector next to the Order input.
// Wait, is there an order input? Let's check what's there.

// We can just inject the session dropdown in the grid.
const newGridItem = `
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-muted uppercase">Session</label>
                      <select value={item.session || 1} onChange={e => {
                        const newItems = [...roundtablesData.items];
                        newItems[i].session = parseInt(e.target.value);
                        setRoundtablesData({...roundtablesData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded font-bold">
                        <option value={1}>Session 1</option>
                        <option value={2}>Session 2</option>
                      </select>
                    </div>
`;

content = content.replace(/(<label className="block text-xs font-semibold mb-1 text-text-muted uppercase">Short Title<\/label>[\s\S]*?<\/div>)/, "$1" + newGridItem);

fs.writeFileSync('src/app/admin/page.tsx', content);
