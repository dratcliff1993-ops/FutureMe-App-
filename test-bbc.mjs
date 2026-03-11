import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

try {
  console.log('Loading BBC Finance FTSE...');
  await page.goto('https://www.bbc.com/news/business_market_data', { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  const data = await page.evaluate(() => {
    const text = document.body.innerText;
    const lines = text.split('\n').filter(l => l.includes('FTSE') || /[\d,]+\.[\d]{2}/.test(l));
    return lines.slice(0, 15);
  });
  
  console.log('BBC Results:');
  console.log(data.join('\n'));
} catch (e) {
  console.error('Error:', e.message);
}

await browser.close();
