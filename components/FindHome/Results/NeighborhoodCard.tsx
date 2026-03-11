'use client';

import { Neighborhood } from '@/lib/data/dummyNeighborhoods';
import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';

interface NeighborhoodCardProps {
  neighborhood: Neighborhood & {
    score?: number;
    breakdown?: any;
    dataQuality?: {
      crimeReal: boolean;
      poiReal: boolean;
    };
  };
}

export default function NeighborhoodCard({ neighborhood }: NeighborhoodCardProps) {
  const { setSelectedNeighborhood } = useFindHomeStore();

  const scoreColor =
    (neighborhood.score || 0) >= 80
      ? 'bg-green-100 text-green-800'
      : (neighborhood.score || 0) >= 60
        ? 'bg-blue-100 text-blue-800'
        : (neighborhood.score || 0) >= 40
          ? 'bg-amber-100 text-amber-800'
          : 'bg-red-100 text-red-800';

  return (
    <button
      onClick={() => setSelectedNeighborhood(neighborhood as any)}
      className="text-left block w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl overflow-hidden hover:shadow-xl hover:border-blue-500/50 transition group"
    >
      {/* Image */}
      <div className="relative h-40 bg-slate-700 overflow-hidden">
        <img
          src={neighborhood.imageUrl}
          alt={neighborhood.name}
          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-40"></div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-white">{neighborhood.name}</h3>
            <p className="text-sm text-slate-400">{neighborhood.city}</p>
          </div>
          {neighborhood.score !== undefined && (
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${scoreColor}`}>
              {neighborhood.score}%
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-slate-300 mb-3 line-clamp-2">{neighborhood.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-slate-700/50 rounded p-2 border border-slate-600/30">
            <div className="text-xs text-slate-400">Price</div>
            <div className="text-sm font-semibold text-white">
              £{(neighborhood.medianHousePrice / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="bg-slate-700/50 rounded p-2 border border-slate-600/30">
            <div className="text-xs text-slate-400">Walkability</div>
            <div className="text-sm font-semibold text-white">{neighborhood.walkability}</div>
          </div>
          <div className="bg-slate-700/50 rounded p-2 border border-slate-600/30">
            <div className="text-xs text-slate-400">Commute</div>
            <div className="text-sm font-semibold text-white">{neighborhood.averageCommute}m</div>
          </div>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-3">
          {neighborhood.highlights.slice(0, 3).map((highlight, idx) => (
            <span
              key={idx}
              className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full font-medium border border-blue-500/30"
            >
              {highlight}
            </span>
          ))}
        </div>

        {/* Data Quality Badges */}
        {neighborhood.dataQuality && (neighborhood.dataQuality.crimeReal || neighborhood.dataQuality.poiReal) && (
          <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-700/50">
            {neighborhood.dataQuality.crimeReal && (
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full font-medium border border-green-500/30">
                🔒 Real crime data
              </span>
            )}
            {neighborhood.dataQuality.poiReal && (
              <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full font-medium border border-green-500/30">
                📍 Real POI data
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
