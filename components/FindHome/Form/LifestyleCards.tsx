'use client';

import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';

export default function LifestyleCards() {
  const { demographic, setDemographic, maxHousePrice, setMaxHousePrice, minHousePrice, setMinHousePrice } = useFindHomeStore();

  const demographics = [
    { id: 'young_professionals', label: '💼 Young Professionals', description: 'Nightlife, walkability, opportunities' },
    { id: 'families', label: '👨‍👩‍👧‍👦 Families', description: 'Schools, parks, safety, community' },
    { id: 'retirees', label: '👴 Retirees', description: 'Quiet, accessible, green spaces' },
    { id: 'students', label: '🎓 Students', description: 'Affordable, vibrant, transport' },
    { id: 'mixed', label: '🌍 No Preference', description: 'Balanced across all factors' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-white mb-3">Who Are You?</label>
        <div className="grid grid-cols-1 gap-2">
          {demographics.map((demo) => (
            <button
              key={demo.id}
              onClick={() => setDemographic(demo.id as any)}
              className={`p-3 rounded-lg border transition text-left ${
                demographic === demo.id
                  ? 'border-blue-500/50 bg-blue-500/10 text-white'
                  : 'border-slate-600/50 hover:border-slate-500/50 bg-slate-700/30'
              }`}
            >
              <div className={`font-medium text-sm ${demographic === demo.id ? 'text-white' : 'text-slate-300'}`}>
                {demo.label}
              </div>
              <div className={`text-xs mt-1 opacity-75 ${demographic === demo.id ? 'text-blue-200' : 'text-slate-400'}`}>
                {demo.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-700/50 pt-6">
        <label className="block text-sm font-semibold text-white mb-4">Budget Range</label>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400">Min Price</label>
              <span className="text-sm font-semibold text-blue-400">£{(minHousePrice / 1000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min="200000"
              max="600000"
              step="10000"
              value={minHousePrice}
              onChange={(e) => setMinHousePrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400">Max Price</label>
              <span className="text-sm font-semibold text-blue-400">£{(maxHousePrice / 1000).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min="250000"
              max="1000000"
              step="10000"
              value={maxHousePrice}
              onChange={(e) => setMaxHousePrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
            <p className="text-xs text-slate-300">
              <strong>Range:</strong> £{(minHousePrice / 1000).toFixed(0)}k — £{(maxHousePrice / 1000).toFixed(0)}k
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
