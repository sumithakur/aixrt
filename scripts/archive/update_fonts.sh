#!/bin/bash
sed -i '' "s/import { Montserrat, Inter } from 'next\/font\/google';/import { Ubuntu, Roboto } from 'next\/font\/google';/" src/app/layout.tsx
sed -i '' "s/const montserrat = Montserrat({/const ubuntu = Ubuntu({/" src/app/layout.tsx
sed -i '' "s/weight: \['400', '500', '600', '700', '800'\],/weight: \['300', '400', '500', '700'\],/" src/app/layout.tsx
sed -i '' "s/variable: '--font-montserrat',/variable: '--font-ubuntu',/" src/app/layout.tsx
sed -i '' "s/const inter = Inter({/const roboto = Roboto({/" src/app/layout.tsx
sed -i '' "s/variable: '--font-inter',/variable: '--font-roboto',/" src/app/layout.tsx
sed -i '' "s/className={\`\${montserrat.variable} \${inter.variable}\`}/className={\`\${ubuntu.variable} \${roboto.variable}\`}/" src/app/layout.tsx
sed -i '' "s/\"var(--font-montserrat)\", \"Montserrat\"/\"var(--font-ubuntu)\", \"Ubuntu\"/" tailwind.config.ts
sed -i '' "s/\"var(--font-inter)\", \"Inter\"/\"var(--font-roboto)\", \"Roboto\"/" tailwind.config.ts
