'use client';

import React, { useState, useEffect } from 'react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function MarketTicker() {
  const [markets, setMarkets] = useState<MarketData[]>([
    { symbol: 'Tech Leaders', price: 260.20, change: -0.63, changePercent: -0.24 },
    { symbol: 'Financials', price: 49.57, change: -0.50, changePercent: -0.99 },
    { symbol: 'Energy', price: 56.82, change: 1.22, changePercent: 2.19 },
    { symbol: 'Healthcare', price: 152.68, change: -0.47, changePercent: -0.31 },
    { symbol: 'Gold', price: 475.58, change: -2.29, changePercent: -0.48 },
  ]);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await fetch('/api/markets');
        const data = await response.json();
        if (data.markets && data.markets.length > 0) {
          setMarkets(data.markets);
        }
      } catch (error) {
        console.error('Failed to fetch markets:', error);
      }
    };

    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-black border-b border-blue-600 overflow-hidden">
      <style>{`
        @keyframes tickerScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .ticker-scroll {
          animation: tickerScroll 180s linear infinite;
        }
        .ticker-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="h-10 flex items-center overflow-hidden">
        <div className="ticker-scroll flex gap-8 whitespace-nowrap">
          {[...markets, ...markets, ...markets, ...markets, ...markets, ...markets, ...markets, ...markets, ...markets, ...markets].map((market, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 min-w-max"
            >
              <span className="text-white text-xs font-bold uppercase tracking-wider">
                {market.symbol}
              </span>
              <span className="text-white font-bold text-sm">
                {market.price.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold ${market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {market.changePercent >= 0 ? '↑' : '↓'} {Math.abs(market.changePercent).toFixed(2)}%
              </span>
              <span className="text-white/50 text-xs mx-2">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
