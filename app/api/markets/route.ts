export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    // Using major global stocks as proxy indices (free tier limitation)
    const symbols = [
      { symbol: 'HSBA', display: 'FTSE 100' },  // HSBC - major FTSE 100 constituent
      { symbol: 'SHELL', display: 'FTSE 250' }, // Shell - major FTSE constituent
      { symbol: 'AAPL', display: 'S&P 500' },
      { symbol: 'MSFT', display: 'NASDAQ' },
      { symbol: 'SAP', display: 'DAX' }
    ];

    const promises = symbols.map(({ symbol, display }) =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
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
