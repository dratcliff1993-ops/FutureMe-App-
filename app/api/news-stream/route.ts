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

    const newsUrl = `https://api.worldnewsapi.com/search-news?text=stock%20market%20finance%20investing%20economy%20business&number=100`;
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

    // Whitelist of trusted financial & personal finance news sources
    const trustedSources = [
      'bbc.com', 'bbc.co.uk',
      'theguardian.com', 'guardian.co.uk',
      'ft.com', 'financial-times',
      'thetimes.com', 'thetimes.co.uk',
      'telegraph.co.uk',
      'economist.com',
      'bloomberg.com',
      'cnbc.com',
      'reuters.com',
      'ap.org',
      'apnews.com',
      'independent.co.uk',
      'mortgages.co.uk',
      'moneysupermarket.com',
      'moneyhelper.org.uk',
      'moneywise.com',
      'thisismoney.com',
      'which.co.uk',
      'investopedia.com',
      'statista.com',
      'bbc.com',
      'cnbc.com',
      'marketwatch.com',
      'fool.com',
      'kiplinger.com',
      'theaustralian.com.au',
      'afr.com',
      'nzherald.co.nz',
      'theage.com.au',
      'smh.com.au',
      'dailymail.co.uk',
      'mirror.co.uk',
      'express.co.uk',
      'standard.co.uk',
      'cbsnews.com',
      'abc.net.au',
      'theguardian.com',
      'wsj.com',
      'nyt.com',
      'nytimes.com',
      'theinformation.com',
    ];

    // Personal finance & business focused keywords
    const financeKeywords = [
      'finance', 'personal finance', 'money', 'savings', 'invest', 'investment',
      'stock', 'shares', 'market', 'mortgage', 'property', 'house', 'interest rate',
      'inflation', 'economy', 'economic', 'business', 'company',
      'pension', 'retirement', 'isa', 'banking', 'credit card', 'loan',
      'tax', 'budget', 'income', 'salary', 'wage', 'bank',
      'crypto', 'bitcoin', 'dividend', 'bond', 'portfolio', 'profit', 'earnings',
      'ftse', 'nasdaq', 'dow', 'financial', 'business', 'cost of living', 'wealth',
      'debt', 'credit', 'banking', 'insurance', 'fund', 'advisor', 'planner',
      'earning', 'revenue', 'growth', 'gdp', 'inflation', 'price'
    ];

    // Sports, entertainment, celebrity & geopolitical keywords to exclude
    const excludeKeywords = [
      'football', 'soccer', 'sport', 'player', 'cricket', 'rugby', 'nfl', 'nba',
      'movie', 'film', 'actor', 'celebrity', 'gossip', 'entertainment',
      'tv', 'television', 'award', 'oscar', 'grammy', 'viral',
      'war', 'conflict', 'military', 'attack', 'bomb', 'terrorist', 'shooting',
      'divorce', 'marriage', 'relationship', 'dating', 'prince', 'royal',
      'horoscope', 'astrology', 'zodiac'
    ];

    const filteredNews = data.news.filter((article: any) => {
      try {
        // Extract domain from URL
        const url = new URL(article.url);
        const domain = url.hostname.toLowerCase();
        const pathname = url.pathname.toLowerCase();

        // Check if source is trusted
        const isTrustedSource = trustedSources.some(trusted => domain.includes(trusted));
        if (!isTrustedSource) return false;

        // Exclude sports sections and entertainment sections from URLs
        const excludedPaths = ['/sport/', '/sports/', '/entertainment/', '/celebrity/', '/gossip/', '/football/', '/cricket/', '/rugby/'];
        if (excludedPaths.some(path => pathname.includes(path))) {
          return false;
        }

        // Check content for finance keywords
        const text = `${article.title} ${article.summary || ''}`.toLowerCase();
        const hasFinanceKeyword = financeKeywords.some(keyword => text.includes(keyword));
        if (!hasFinanceKeyword) return false;

        // Exclude sports and entertainment content in text
        const hasExcludedKeyword = excludeKeywords.some(keyword => text.includes(keyword));
        if (hasExcludedKeyword) return false;

        return true;
      } catch {
        return false;
      }
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
