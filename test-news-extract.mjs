import fetch from 'node-fetch';

const apiKey = 'd4e9d666e614402cab893ff4134f3f0b';
const response = await fetch(
  `https://newsapi.org/v2/everything?q=FTSE+100&sortBy=publishedAt&language=en&pageSize=5&apiKey=${apiKey}`
);

const data = await response.json();

console.log('Found articles:');
for (const article of data.articles || []) {
  const text = `${article.title} | ${article.description || ''}`;
  console.log('\n---');
  console.log('Title:', article.title);
  console.log('Description:', article.description);
  console.log('Full text:', text.substring(0, 200));
  
  // Check for numbers that look like prices
  const numbers = text.match(/\b\d{1,2},?\d{3}(?:\.\d{2})?\b/g);
  if (numbers) console.log('Numbers found:', numbers);
}
