async function fetchLatestNews() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;

    if (!apiKey) {
      console.error('NewsAPI key not configured');
      return [];
    }

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=gb&category=business&pageSize=6&apiKey=${apiKey}`
    );

    if (!response.ok) {
      console.error('NewsAPI response not ok:', response.status);
      return [];
    }

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      console.error('No articles returned from NewsAPI');
      return [];
    }

    return data.articles.map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt
    }));
  } catch (error) {
    console.error('News fetch error:', error);
    return [];
  }
}

export async function GET(request: Request) {
  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        const news = await fetchLatestNews();

        if (news.length > 0) {
          controller.enqueue(`data: ${JSON.stringify(news)}\n\n`);
        } else {
          controller.enqueue(`data: ${JSON.stringify([])}\n\n`);
        }

        // Close the stream after sending
        controller.close();
      } catch (error) {
        console.error('Stream error:', error);
        controller.close();
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
