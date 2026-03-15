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

    const newsUrl = `https://api.worldnewsapi.com/search-news?text=finance%20OR%20stock%20OR%20market%20OR%20banking%20OR%20investment%20OR%20economy&number=10`;
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

    const articles = data.news.map((article: any) => ({
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
