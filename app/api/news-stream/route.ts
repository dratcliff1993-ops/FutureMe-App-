export async function GET(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;

    if (!apiKey) {
      console.error('World News API key not configured');
      return new Response(JSON.stringify({ error: 'API key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newsUrl = `https://api.worldnewsapi.com/search-news?text=business&number=50`;
    console.log('Fetching from World News API...');

    const response = await fetch(newsUrl, {
      headers: {
        'x-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('World News API error:', response.status, errorText);
      return new Response(JSON.stringify({ error: `World News API returned ${response.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('World News API response:', data.news?.length, 'articles available');

    if (!data.news || data.news.length === 0) {
      console.warn('No articles returned from World News API');
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Finance keywords for filtering
    const financeKeywords = ['finance', 'stock', 'market', 'invest', 'bank', 'crypto', 'forex', 'trading', 'economy', 'earnings', 'dividend', 'bond', 'fund', 'portfolio', 'bullish', 'bearish', 'nasdaq', 'ftse', 'dow', 'bitcoin', 'ethereum', 'payment', 'mortgage', 'loan', 'interest', 'inflation', 'recession', 'bull', 'bear', 'ipo', 'merger', 'acquisition', 'wealth', 'pension', 'ira', '401k'];

    const filteredNews = data.news.filter((article: any) => {
      const text = `${article.title} ${article.summary || ''}`.toLowerCase();
      return financeKeywords.some(keyword => text.includes(keyword));
    }).slice(0, 6);

    const articles = filteredNews.map((article: any) => ({
      id: article.id.toString(),
      title: article.title,
      description: article.summary || article.text?.substring(0, 150),
      source: article.source_country?.toUpperCase() || 'News',
      url: article.url,
      imageUrl: article.image,
      publishedAt: article.publish_date
    }));

    console.log('Returning', articles.length, 'formatted articles');

    return new Response(JSON.stringify(articles), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('News API error:', error instanceof Error ? error.message : error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
