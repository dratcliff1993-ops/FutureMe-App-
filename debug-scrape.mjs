import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('https://finance.yahoo.com/quote/^FTSE', { waitUntil: 'networkidle2', timeout: 20000 });

// Try to dismiss consent or just wait for content
await page.evaluate(() => {
  const rejectBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reject'));
  if (rejectBtn) rejectBtn.click();
});

await page.waitForTimeout(2000);

const data = await page.evaluate(() => {
  const text = document.body.innerText;
  // Find price-like patterns
  const lines = text.split('\n').filter(l => l.trim());
  const relevantLines = lines.filter(l => /[\d,]+\.[\d]{2}|FTSE|Price|Change/.test(l));
  return relevantLines.slice(0, 20);
});

console.log(data.join('\n'));
await browser.close();
