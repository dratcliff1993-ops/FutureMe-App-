export async function GET() {
  try {
    // Fetch real crypto prices from CoinGecko
    const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=gbp&include_24hr_change=true');
    const cryptoData = await cryptoRes.json();

    const markets = [];

    // Bitcoin - real data from CoinGecko
    if (cryptoData.bitcoin) {
      markets.push({
        symbol: 'Bitcoin',
        price: cryptoData.bitcoin.gbp,
        change: 0,
        changePercent: cryptoData.bitcoin.gbp_24h_change || 0
      });
    }

    // Fetch stock data from Alpha Vantage (free tier)
    const alphaKey = 'demo';

    const tickers = [
      { symbol: 'GLD', display: 'Gold' },
      { symbol: 'QQQ', display: 'NASDAQ-100' },
      { symbol: 'DIA', display: 'Dow Jones' },
      { symbol: 'SPY', display: 'S&P 500' },
      { symbol: 'EWG', display: 'Germany DAX' },
      { symbol: 'EWQ', display: 'France CAC' },
      { symbol: 'EWI', display: 'Italy MIB' },
      { symbol: 'EWN', display: 'Netherlands' },
      { symbol: 'EWP', display: 'Spain IBEX' }
    ];

    const stockPromises = tickers.map(async ({ symbol, display }) => {
      try {
        const res = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${alphaKey}`
        );
        const data = await res.json();

        if (data['Global Quote'] && data['Global Quote']['05. price']) {
          const price = parseFloat(data['Global Quote']['05. price']);
          const change = parseFloat(data['Global Quote']['09. change']) || 0;
          const changePercent = parseFloat(data['Global Quote']['10. change percent']?.replace('%', '')) || 0;

          return {
            symbol: display,
            price: price,
            change: change,
            changePercent: changePercent
          };
        }
      } catch (e) {
        console.error(`Failed to fetch ${symbol}:`, e);
      }
      return null;
    });

    const stocks = (await Promise.all(stockPromises)).filter(m => m !== null);
    markets.push(...stocks);

    return Response.json({ markets });
  } catch (error) {
    console.error('Markets API error:', error);
    return Response.json({ markets: [] }, { status: 500 });
  }
}
