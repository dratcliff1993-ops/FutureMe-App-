export async function GET(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    if (!apiKey) {
      console.error('Finnhub API key not configured');
      return new Response(JSON.stringify({ error: 'API key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newsUrl = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}&limit=6`;
    console.log('Fetching from Finnhub...');

    const response = await fetch(newsUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Finnhub error:', response.status, errorText);
      return new Response(JSON.stringify({ error: `Finnhub returned ${response.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('Finnhub response:', data.length, 'articles available');

    if (!Array.isArray(data) || data.length === 0) {
      console.warn('No articles returned from Finnhub');
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const articles = data.map((article: any) => ({
      id: article.id || article.url,
      title: article.headline,
      description: article.summary || article.headline,
      source: article.source,
      url: article.url,
      imageUrl: article.image,
      publishedAt: new Date(article.datetime * 1000).toISOString()
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
