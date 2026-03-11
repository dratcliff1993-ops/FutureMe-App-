'use client';

import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';
import { getLivabilityScore } from '@/lib/data/livabilityScores';
import { getPOIsByAreaId } from '@/lib/data/dummyPOI';

export default function NeighborhoodDetail() {
  const { selectedNeighborhood, setSelectedNeighborhood } = useFindHomeStore();

  if (!selectedNeighborhood) {
    return null;
  }

  const livScore = getLivabilityScore(selectedNeighborhood.id);
  const areaPOIs = getPOIsByAreaId(selectedNeighborhood.areaId);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end z-50 md:items-center md:justify-center">
      <div className="w-full md:w-2xl md:max-h-96 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-t-3xl md:rounded-3xl overflow-y-auto max-h-screen md:max-h-96">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/90 border-b border-slate-700/50 p-4 md:p-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{selectedNeighborhood.name}</h2>
            <p className="text-slate-400">{selectedNeighborhood.city}</p>
          </div>
          <button
            onClick={() => setSelectedNeighborhood(null)}
            className="text-2xl text-slate-400 hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Image */}
          <img
            src={selectedNeighborhood.imageUrl}
            alt={selectedNeighborhood.name}
            className="w-full h-48 object-cover rounded-lg"
          />

          {/* Overview */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Overview</h3>
            <p className="text-slate-300 mb-3">{selectedNeighborhood.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="text-xs text-blue-400 font-semibold">Median House Price</div>
                <div className="text-lg font-bold text-blue-200">
                  £{(selectedNeighborhood.medianHousePrice / 1000).toFixed(0)}k
                </div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="text-xs text-blue-400 font-semibold">Population Density</div>
                <div className="text-lg font-bold text-blue-200">
                  {(selectedNeighborhood.populationDensity / 1000).toFixed(1)}k/km²
                </div>
              </div>
            </div>
          </div>

          {/* Livability Scores */}
          {livScore && (
            <div>
              <h3 className="text-lg font-bold text-white mb-3">Livability Scores</h3>
              <div className="space-y-2">
                {Object.entries(livScore.categories).map(([category, score]) => (
                  <div key={category} className="flex items-center gap-2">
                    <div className="text-sm font-medium text-slate-300 w-24 capitalize">
                      {category}
                    </div>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-2 overflow-hidden border border-slate-600/50">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                    <div className="text-sm font-bold text-blue-300 w-12 text-right">{score}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* POIs */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Points of Interest</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
                <div className="text-sm font-semibold text-green-400">🌳 Parks</div>
                <div className="text-2xl font-bold text-green-300">
                  {selectedNeighborhood.poiCounts.parks}
                </div>
              </div>
              <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
                <div className="text-sm font-semibold text-orange-400">🍺 Pubs</div>
                <div className="text-2xl font-bold text-orange-300">
                  {selectedNeighborhood.poiCounts.pubs}
                </div>
              </div>
              <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
                <div className="text-sm font-semibold text-purple-400">🎨 Museums</div>
                <div className="text-2xl font-bold text-purple-300">
                  {selectedNeighborhood.poiCounts.museums}
                </div>
              </div>
              <div className="bg-pink-500/10 rounded-lg p-3 border border-pink-500/20">
                <div className="text-sm font-semibold text-pink-400">🍽️ Restaurants</div>
                <div className="text-2xl font-bold text-pink-300">
                  {selectedNeighborhood.poiCounts.restaurants}
                </div>
              </div>
              <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20">
                <div className="text-sm font-semibold text-cyan-400">💪 Gyms</div>
                <div className="text-2xl font-bold text-cyan-300">{selectedNeighborhood.poiCounts.gyms}</div>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                <div className="text-sm font-semibold text-red-400">🎓 Schools</div>
                <div className="text-2xl font-bold text-red-300">{selectedNeighborhood.poiCounts.schools}</div>
              </div>
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">What Makes It Special</h3>
            <div className="flex flex-wrap gap-2">
              {selectedNeighborhood.highlights.map((highlight, idx) => (
                <span
                  key={idx}
                  className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-500/30"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
