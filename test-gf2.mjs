import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
await page.setViewport({ width: 1280, height: 720 });

try {
  console.log('Loading Google Finance...');
  await page.goto('https://www.google.com/finance/quote/FTSE:INDEXFTSE', { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  // Click accept all if visible
  try {
    const acceptBtn = await page.$('button:has-text("Accept all")');
    if (acceptBtn) await acceptBtn.click();
  } catch (e) {}
  
  // Wait a bit for content to load
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 }).catch(() => {});
  
  const data = await page.evaluate(() => {
    const allText = document.body.innerText;
    return allText.split('\n').slice(0, 40);
  });
  
  console.log(data.join('\n'));
} catch (e) {
  console.error('Error:', e.message);
}

await browser.close();
