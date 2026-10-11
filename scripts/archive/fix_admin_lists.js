const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// I will append the schedule items mapping back to programme tab
const programmeSchedule = `
              <h3 className="font-semibold text-brand-secondary mt-8">Schedule Items</h3>
              {programmeData.items?.map((item: any, i: number) => (
                <div key={i} className="p-6 border border-border-subtle bg-bg-surface rounded-lg relative">
                  <button onClick={() => {
                    const newItems = [...programmeData.items];
                    newItems.splice(i, 1);
                    setProgrammeData({...programmeData, items: newItems});
                  }} className="absolute top-4 right-4 text-brand-rose text-sm font-semibold hover:underline">Remove</button>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-muted uppercase">Start Time</label>
                      <input type="text" value={item.start || ''} onChange={e => {
                        const newItems = [...programmeData.items];
                        newItems[i].start = e.target.value;
                        setProgrammeData({...programmeData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded text-text-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-muted uppercase">End Time</label>
                      <input type="text" value={item.end || ''} onChange={e => {
                        const newItems = [...programmeData.items];
                        newItems[i].end = e.target.value;
                        setProgrammeData({...programmeData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded text-text-primary" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold mb-1 text-text-muted uppercase">Title</label>
                      <input type="text" value={item.title || ''} onChange={e => {
                        const newItems = [...programmeData.items];
                        newItems[i].title = e.target.value;
                        setProgrammeData({...programmeData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded font-bold text-text-primary" />
                    </div>
                  </div>
                </div>
              ))}
`;
content = content.replace("<button onClick={() => saveFile('programme.json', programmeData)}", programmeSchedule + "\n              <button onClick={() => saveFile('programme.json', programmeData)}");

const roundtablesList = `
              <h3 className="font-semibold text-brand-secondary mt-8">Roundtable Tracks</h3>
              {roundtablesData.items?.map((item: any, i: number) => (
                <div key={i} className="p-6 border border-border-subtle bg-bg-surface rounded-lg relative">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-muted uppercase">Table Title</label>
                      <input type="text" value={item.title || ''} onChange={e => {
                        const newItems = [...roundtablesData.items];
                        newItems[i].title = e.target.value;
                        setRoundtablesData({...roundtablesData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded font-bold text-text-primary" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold mb-1 text-text-muted uppercase">Proposed Chair / Sponsor</label>
                      <input type="text" value={item.chair?.organisation || item.chair?.proposed || ''} onChange={e => {
                        const newItems = [...roundtablesData.items];
                        if (!newItems[i].chair) newItems[i].chair = {};
                        newItems[i].chair.organisation = e.target.value;
                        newItems[i].chair.proposed = e.target.value;
                        setRoundtablesData({...roundtablesData, items: newItems});
                      }} className="w-full p-2 bg-bg-base border border-border-subtle rounded text-text-primary" />
                    </div>
                  </div>
                </div>
              ))}
`;
content = content.replace("<button onClick={() => saveFile('roundtables.json', roundtablesData)}", roundtablesList + "\n              <button onClick={() => saveFile('roundtables.json', roundtablesData)}");

fs.writeFileSync('src/app/admin/page.tsx', content);
