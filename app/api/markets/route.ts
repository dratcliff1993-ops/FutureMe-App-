export async function GET() {
  try {
    const finnhubKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    // Major global indices & assets - using stocks/ETFs as proxies where index data unavailable
    const symbols = [
      { symbol: 'BTC', display: 'Bitcoin' },
      { symbol: 'GLD', display: 'Gold' },
      { symbol: 'QQQ', display: 'NASDAQ-100' },  // NASDAQ proxy
      { symbol: 'DIA', display: 'Dow Jones' },   // Dow proxy
      { symbol: 'SPY', display: 'S&P 500' },     // S&P proxy
      { symbol: 'EWG', display: 'Germany DAX' }, // Germany
      { symbol: 'EWQ', display: 'France CAC' },  // France
      { symbol: 'EWI', display: 'Italy MIB' },   // Italy
      { symbol: 'EWN', display: 'Netherlands' }, // Netherlands
      { symbol: 'EWP', display: 'Spain IBEX' }   // Spain
    ];

    const promises = symbols.map(({ symbol, display }) =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubKey}`)
        .then(r => r.json())
        .then(data => {
          if (data.error) return null;
          return {
            symbol: display,
            price: data.c || 0,
            change: data.d || 0,
            changePercent: data.dp || 0
          };
        })
        .catch(() => null)
    );

    const markets = (await Promise.all(promises)).filter(m => m !== null);

    return Response.json({ markets });
  } catch (error) {
    console.error('Markets API error:', error);
    return Response.json({ markets: [] }, { status: 500 });
  }
}
