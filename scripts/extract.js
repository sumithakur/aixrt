const puppeteer = require('/tmp/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TARGET_URL = 'https://www.aixsummithack.com/';
const WORKSPACE = path.resolve(__dirname, '..');

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Track network assets (fonts, woff2, svgs, logos)
  const networkAssets = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('.woff') || url.includes('.woff2') || url.includes('logo') || url.includes('brand') || url.includes('svg') || url.includes('favicon')) {
      networkAssets.push(url);
    }
  });

  console.log(`Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise(r => setTimeout(r, 4000)); // wait for animations and fonts to settle

  // Viewports for screenshots: 1920, 1440, 1024, 768, 390
  const viewports = [
    { width: 1920, height: 1080, name: 'screenshot-1920.png' },
    { width: 1440, height: 900, name: 'screenshot-1440.png' },
    { width: 1024, height: 768, name: 'screenshot-1024.png' },
    { width: 768, height: 1024, name: 'screenshot-768.png' },
    { width: 390, height: 844, name: 'screenshot-390.png' }
  ];

  for (const vp of viewports) {
    console.log(`Taking screenshot at ${vp.width}x${vp.height}...`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(WORKSPACE, 'design/reference', vp.name),
      fullPage: true
    });
  }

  // Set viewport back to 1440 for extraction
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Computed design system extraction per Section 5.1
  console.log('Extracting computed design system...');
  const designSystem = await page.evaluate(() => {
    const els = [...document.querySelectorAll('*')];
    const freq = (fn) => {
      const m = new Map();
      els.forEach(el => {
        const v = fn(getComputedStyle(el));
        if (v) m.set(v, (m.get(v) || 0) + 1);
      });
      return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
    };

    return {
      colors: freq(s => s.color),
      backgrounds: freq(s => s.backgroundColor),
      gradients: freq(s => s.backgroundImage !== 'none' ? s.backgroundImage : null),
      fonts: freq(s => s.fontFamily),
      weights: freq(s => s.fontWeight),
      sizes: freq(s => s.fontSize),
      lineHeights: freq(s => s.lineHeight),
      letterSpace: freq(s => s.letterSpacing),
      radii: freq(s => s.borderRadius),
      shadows: freq(s => s.boxShadow !== 'none' ? s.boxShadow : null),
      borders: freq(s => s.borderColor),
      transitions: freq(s => s.transition !== 'all 0s ease 0s' ? s.transition : null)
    };
  });

  fs.writeFileSync(
    path.join(WORKSPACE, 'design/reference/computed-frequencies.json'),
    JSON.stringify(designSystem, null, 2)
  );

  // 2. Dump :root custom properties
  console.log('Dumping :root custom properties...');
  const rootProps = await page.evaluate(() => {
    const r = getComputedStyle(document.documentElement);
    return Object.fromEntries(
      [...r].filter(p => p.startsWith('--')).map(p => [p, r.getPropertyValue(p).trim()])
    );
  });

  fs.writeFileSync(
    path.join(WORKSPACE, 'design/reference/root-props.json'),
    JSON.stringify(rootProps, null, 2)
  );

  // 3. Extract hero details, buttons, navbar, logos
  console.log('Inspecting hero, buttons, and navigation...');
  const heroAndComponents = await page.evaluate(() => {
    const nav = document.querySelector('header') || document.querySelector('nav');
    const hero = document.querySelector('section') || document.querySelector('main > div');
    const buttons = [...document.querySelectorAll('button, a[class*="btn"], a[role="button"]')];
    const videos = [...document.querySelectorAll('video')].map(v => ({ src: v.src, currentSrc: v.currentSrc, className: v.className }));
    const canvases = [...document.querySelectorAll('canvas')].length;
    const svgs = [...document.querySelectorAll('svg')].map(s => ({
      outerHTML: s.outerHTML.slice(0, 800),
      className: s.getAttribute('class'),
      id: s.getAttribute('id')
    }));
    const images = [...document.querySelectorAll('img')].map(i => ({
      src: i.src,
      alt: i.alt,
      className: i.className
    }));

    // Find the logo image/element
    const logoEl = document.querySelector('header img, nav img, a[href="/"] img, img[alt*="logo" i], img[src*="logo" i]');
    const logoUrl = logoEl ? logoEl.src : null;

    return {
      nav: nav ? {
        bg: getComputedStyle(nav).backgroundColor,
        backdropFilter: getComputedStyle(nav).backdropFilter,
        border: getComputedStyle(nav).borderBottom,
        boxShadow: getComputedStyle(nav).boxShadow
      } : null,
      hero: hero ? {
        bg: getComputedStyle(hero).backgroundColor,
        bgImg: getComputedStyle(hero).backgroundImage,
        boxShadow: getComputedStyle(hero).boxShadow
      } : null,
      videos,
      canvases,
      buttonSample: buttons.slice(0, 10).map(b => ({
        text: b.innerText,
        bg: getComputedStyle(b).backgroundColor,
        color: getComputedStyle(b).color,
        border: getComputedStyle(b).border,
        borderRadius: getComputedStyle(b).borderRadius,
        padding: getComputedStyle(b).padding,
        fontSize: getComputedStyle(b).fontSize,
        boxShadow: getComputedStyle(b).boxShadow,
        transition: getComputedStyle(b).transition
      })),
      images,
      logoUrl,
      svgCount: svgs.length,
      svgSample: svgs.slice(0, 5)
    };
  });

  fs.writeFileSync(
    path.join(WORKSPACE, 'design/reference/elements-inspection.json'),
    JSON.stringify(heroAndComponents, null, 2)
  );

  fs.writeFileSync(
    path.join(WORKSPACE, 'design/reference/network-assets.json'),
    JSON.stringify(networkAssets, null, 2)
  );

  console.log('Extraction complete! Closing browser...');
  await browser.close();
}

run().catch(err => {
  console.error('Error running extraction:', err);
  process.exit(1);
});
