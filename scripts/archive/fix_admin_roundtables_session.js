const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

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

content = content.replace(/(<div className="grid grid-cols-1 gap-4">)/, "$1\n" + newGridItem);

fs.writeFileSync('src/app/admin/page.tsx', content);
