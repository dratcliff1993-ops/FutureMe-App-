export async function GET(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;

    if (!apiKey) {
      return new Response('API key not configured', { status: 500 });
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=gb&category=business&pageSize=6&apiKey=${apiKey}`
    );

    if (!response.ok) {
      return new Response('NewsAPI request failed', { status: 502 });
    }

    const data = await response.json();

    const articles = (data.articles || []).map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt
    }));

    // Return as JSON, not SSE format
    return new Response(JSON.stringify(articles), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('News API error:', error);
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
