let cachedNews: any[] = [];
let lastFetchTime = 0;
let isFetching = false;

async function fetchLatestNews() {
  if (isFetching) return;

  try {
    isFetching = true;
    const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=UK+finance+stocks+economy&sortBy=publishedAt&language=en&pageSize=6&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('NewsAPI request failed');
    }

    const data = await response.json();
    const newArticles = data.articles.map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      source: article.source.name,
      url: article.url,
      imageUrl: article.urlToImage,
      publishedAt: article.publishedAt
    }));

    return newArticles;
  } catch (error) {
    console.error('News API error:', error);
    return [];
  } finally {
    isFetching = false;
  }
}

function hasNewsChanged(newNews: any[], oldNews: any[]): boolean {
  if (newNews.length !== oldNews.length) return true;

  for (let i = 0; i < newNews.length; i++) {
    if (newNews[i].id !== oldNews[i].id) return true;
  }

  return false;
}

export async function GET(request: Request) {
  const responseStream = new ReadableStream({
    async start(controller) {
      const sendNews = (news: any[]) => {
        controller.enqueue(
          `data: ${JSON.stringify(news)}\n\n`
        );
      };

      // Send initial cached news if available
      if (cachedNews.length > 0) {
        sendNews(cachedNews);
      } else {
        // Fetch initial news
        const initialNews = await fetchLatestNews();
        if (initialNews.length > 0) {
          cachedNews = initialNews;
          sendNews(initialNews);
        }
      }

      // Set up interval to fetch new news every 30 seconds
      const interval = setInterval(async () => {
        const newNews = await fetchLatestNews();

        if (newNews.length > 0 && hasNewsChanged(newNews, cachedNews)) {
          cachedNews = newNews;
          sendNews(newNews);
        }
      }, 30000);

      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
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
