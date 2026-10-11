const fs = require('fs');

let content = fs.readFileSync('src/app/programme/page.tsx', 'utf8');

// Replace the hardcoded description with rawData.hero.description
content = content.replace(
  />One intensive day, 10:00 to 16:30, followed by a networking reception to 18:00\. Designed specifically to maximize high-density executive conversation\.</g,
  ">{rawData.hero.description || 'One intensive day, 14:00 to 18:00, followed by a networking reception. Designed specifically to maximize high-density executive conversation.'}<"
);

// We need to replace the Schedule Overview list with dynamic items
const oldScheduleBlock = `<ul className="space-y-3 text-xs text-text-secondary">
                  <li className="flex items-center justify-between">
                    <span className="text-text-muted">Registration & Arrival</span>
                    <span className="font-mono font-medium text-text-primary">10:00 – 10:30</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-text-muted">Morning Plenary Stage</span>
                    <span className="font-mono font-medium text-text-primary">10:30 – 12:15</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-text-muted">Hosted Executive Lunch</span>
                    <span className="font-mono font-medium text-text-primary">12:15 – 13:15</span>
                  </li>
                  <li className="flex items-center justify-between text-brand-secondary font-semibold">
                    <span>Six Roundtables Block</span>
                    <span className="font-mono">13:15 – 15:00</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-text-muted">Enterprise Connections</span>
                    <span className="font-mono font-medium text-text-primary">15:00 – 15:30</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-text-muted">Plenary Synthesis Panel</span>
                    <span className="font-mono font-medium text-text-primary">15:30 – 16:30</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="text-text-muted">Networking Reception</span>
                    <span className="font-mono font-medium text-text-primary">16:30 – 18:00</span>
                  </li>
                </ul>`;

const dynamicScheduleBlock = `<ul className="space-y-3 text-xs text-text-secondary">
                  {programme.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span className="text-text-muted">{item.title}</span>
                      <span className="font-mono font-medium text-text-primary">{item.start} – {item.end}</span>
                    </li>
                  ))}
                </ul>`;

content = content.replace(oldScheduleBlock, dynamicScheduleBlock);

fs.writeFileSync('src/app/programme/page.tsx', content);
