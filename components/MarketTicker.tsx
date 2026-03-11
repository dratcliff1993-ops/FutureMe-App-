'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MarketModal from './MarketModal';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export default function MarketTicker() {
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [markets, setMarkets] = useState<MarketData[]>([
    { symbol: 'FTSE 100', price: 8132.45, change: 45.2, changePercent: 0.56 },
    { symbol: 'FTSE 250', price: 21456.80, change: 78.3, changePercent: 0.37 },
    { symbol: 'S&P 500', price: 5123.80, change: 32.5, changePercent: 0.64 },
    { symbol: 'NASDAQ', price: 16245.30, change: -15.3, changePercent: -0.09 },
    { symbol: 'DAX', price: 18567.90, change: 123.4, changePercent: 0.67 },
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
            <button
              key={idx}
              onClick={() => setSelectedMarket(market)}
              className="flex items-center gap-2 min-w-max hover:opacity-80 transition cursor-pointer group"
            >
              <span className="text-white text-xs font-bold uppercase tracking-wider group-hover:text-blue-400 transition">
                {market.symbol}
              </span>
              <span className="text-white font-bold text-sm group-hover:text-blue-400 transition">
                {market.price.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-bold ${market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'} group-hover:opacity-80 transition`}>
                {market.changePercent >= 0 ? '↑' : '↓'} {Math.abs(market.changePercent).toFixed(2)}%
              </span>
              <span className="text-white/50 text-xs mx-2">•</span>
            </button>
          ))}
        </div>
      </div>

      {/* Market Detail Modal */}
      <AnimatePresence>
        {selectedMarket && (
          <MarketModal market={selectedMarket} onClose={() => setSelectedMarket(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
