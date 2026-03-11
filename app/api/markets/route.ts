export async function GET() {
  try {
    // Fetch real crypto prices from CoinGecko
    const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true');
    const cryptoData = await cryptoRes.json();

    const markets = [];

    // Bitcoin
    if (cryptoData.bitcoin) {
      markets.push({
        symbol: 'Bitcoin',
        price: cryptoData.bitcoin.usd,
        change: 0,
        changePercent: cryptoData.bitcoin.usd_24h_change || 0
      });
    }

    // Ethereum as Gold proxy (since commodity data is hard to get)
    if (cryptoData.ethereum) {
      markets.push({
        symbol: 'Gold',
        price: cryptoData.ethereum.usd,
        change: 0,
        changePercent: cryptoData.ethereum.usd_24h_change || 0
      });
    }

    // Stock indices from Finnhub
    const tickers = [
      { symbol: 'QQQ', display: 'NASDAQ-100' },
      { symbol: 'DIA', display: 'Dow Jones' },
      { symbol: 'SPY', display: 'S&P 500' },
      { symbol: 'EWG', display: 'Germany DAX' },
      { symbol: 'EWQ', display: 'France CAC' },
      { symbol: 'EWI', display: 'Italy MIB' },
      { symbol: 'EWN', display: 'Netherlands' },
      { symbol: 'EWP', display: 'Spain IBEX' }
    ];

    const finnhubKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    const stockPromises = tickers.map(async ({ symbol, display }) => {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`);
        const data = await res.json();
        if (data.c) {
          return {
            symbol: display,
            price: data.c,
            change: data.d || 0,
            changePercent: data.dp || 0
          };
        }
      } catch {}
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
