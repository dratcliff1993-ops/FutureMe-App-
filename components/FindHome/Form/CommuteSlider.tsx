'use client';

import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';

export default function CommuteSlider() {
  const { maxCommuteMins, setMaxCommuteMins, commuteType, setCommuteType } = useFindHomeStore();

  const commuteTypes = [
    { id: 'transit', label: '🚆 Transit', description: 'Bus, tube, train' },
    { id: 'car', label: '🚗 Car', description: 'Driving' },
    { id: 'bike', label: '🚴 Bike', description: 'Cycling' },
    { id: 'walk', label: '🚶 Walk', description: 'Walking' },
    { id: 'flexible', label: '📍 Flexible', description: 'Any method' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-white mb-3">Commute Type</label>
        <div className="grid grid-cols-2 gap-2">
          {commuteTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setCommuteType(type.id as any)}
              className={`p-3 rounded-lg border transition text-sm font-medium text-center ${
                commuteType === type.id
                  ? 'border-blue-500/50 bg-blue-500/10 text-white'
                  : 'border-slate-600/50 hover:border-slate-500/50 bg-slate-700/30 text-slate-300'
              }`}
            >
              <div>{type.label}</div>
              <div className="text-xs mt-1 opacity-75">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-white">Max Commute Time</label>
          <span className="text-lg font-bold text-blue-400">{maxCommuteMins} mins</span>
        </div>
        <input
          type="range"
          min="10"
          max="90"
          step="5"
          value={maxCommuteMins}
          onChange={(e) => setMaxCommuteMins(Number(e.target.value))}
          className="w-full h-2 bg-slate-700/50 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>10 mins</span>
          <span>90 mins</span>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
        <p className="text-xs text-amber-300">
          💡 Longer commutes expand options but may reduce quality of life
        </p>
      </div>
    </div>
  );
}
