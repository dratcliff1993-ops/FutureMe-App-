export async function GET() {
  try {
    const finnhubKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    // US indices (Finnhub free tier only supports US stocks/indices)
    const symbols = [
      { symbol: '^GSPC', display: 'S&P 500' },
      { symbol: '^IXIC', display: 'NASDAQ' },
      { symbol: '^DJI', display: 'Dow Jones' },
      { symbol: 'AAPL', display: 'Tech Leaders' },
      { symbol: 'XLF', display: 'Financials' },
      { symbol: 'XLE', display: 'Energy' },
      { symbol: 'XLV', display: 'Healthcare' },
      { symbol: 'GLD', display: 'Gold' }
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
