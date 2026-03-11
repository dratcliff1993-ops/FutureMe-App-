export async function GET(request: Request) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_NEWSAPI_KEY;
    
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=UK+personal+finance+OR+savings+OR+mortgages+OR+pensions+OR+tax+OR+budgeting+OR+ISA&sortBy=publishedAt&language=en&pageSize=6&apiKey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('NewsAPI request failed');
    }

    const data = await response.json();

    return Response.json({
      articles: data.articles.map((article: any) => ({
        id: article.url,
        title: article.title,
        description: article.description,
        source: article.source.name,
        url: article.url,
        imageUrl: article.urlToImage,
        publishedAt: article.publishedAt
      }))
    });
  } catch (error) {
    console.error('News API error:', error);
    return Response.json({ articles: [] }, { status: 500 });
  }
}
