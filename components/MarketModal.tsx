'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketModalProps {
  market: { symbol: string; price: number; change: number; changePercent: number } | null;
  onClose: () => void;
}

export default function MarketModal({ market, onClose }: MarketModalProps) {
  const [timeframe, setTimeframe] = useState<'1d' | '5d' | '1m' | '1y' | '5y'>('1d');

  // Demo data - replace with real API data
  const chartData = [
    { time: '09:30', price: market?.price || 0 },
    { time: '10:00', price: (market?.price || 0) * 0.995 },
    { time: '10:30', price: (market?.price || 0) * 1.002 },
    { time: '11:00', price: (market?.price || 0) * 1.005 },
    { time: '11:30', price: (market?.price || 0) * 1.001 },
    { time: '12:00', price: (market?.price || 0) * 1.008 },
    { time: '12:30', price: (market?.price || 0) * 1.006 },
    { time: '13:00', price: (market?.price || 0) * 1.003 },
  ];

  if (!market) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 border-b border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold">{market.symbol}</h2>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold">£{market.price.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</span>
                <span className={`text-lg font-semibold ${market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {market.changePercent >= 0 ? '↑' : '↓'} {Math.abs(market.changePercent).toFixed(2)}%
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-2xl transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Timeframe Selector */}
          <div className="mb-6 flex gap-2 flex-wrap">
            {(['1d', '5d', '1m', '1y', '5y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  timeframe === tf
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => `£${Number(value).toFixed(2)}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={market.changePercent >= 0 ? '#22c55e' : '#ef4444'}
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">High</div>
              <div className="text-xl font-bold text-slate-900">£{(market.price * 1.02).toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Low</div>
              <div className="text-xl font-bold text-slate-900">£{(market.price * 0.98).toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Open</div>
              <div className="text-xl font-bold text-slate-900">£{(market.price * 0.997).toLocaleString('en-GB', { maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm text-slate-600 mb-1">Change</div>
              <div className={`text-xl font-bold ${market.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {market.changePercent >= 0 ? '+' : ''}{market.change.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
