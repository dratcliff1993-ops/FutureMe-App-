import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();

try {
  console.log('Loading Google Finance FTSE 100...');
  await page.goto('https://www.google.com/finance/quote/FTSE:INDEXFTSE', { waitUntil: 'networkidle2', timeout: 15000 });
  
  const data = await page.evaluate(() => {
    const priceEl = document.querySelector('[data-current-price]');
    const changeEl = document.querySelector('[data-change-percent]');
    
    if (!priceEl) {
      return document.body.innerText.split('\n').slice(0, 50);
    }
    
    return {
      price: priceEl?.getAttribute('data-current-price'),
      change: changeEl?.getAttribute('data-change-percent'),
      text: document.body.innerText.split('\n').slice(0, 20)
    };
  });
  
  console.log(JSON.stringify(data, null, 2));
} catch (e) {
  console.error('Error:', e.message);
}

await browser.close();
