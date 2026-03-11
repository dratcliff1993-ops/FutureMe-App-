'use client';

import NeighborhoodCard from './NeighborhoodCard';
import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';

export default function NeighborhoodCardList() {
  const { filteredNeighborhoods } = useFindHomeStore();

  if (filteredNeighborhoods.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-2">No neighborhoods found matching your criteria.</p>
        <p className="text-sm text-slate-500">Try adjusting your budget or commute time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Found <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">{filteredNeighborhoods.length}</span> neighborhoods
          </h2>
          <p className="text-slate-400 mt-1">Ranked by match score</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNeighborhoods.map((neighborhood) => (
          <NeighborhoodCard key={neighborhood.id} neighborhood={neighborhood as any} />
        ))}
      </div>
    </div>
  );
}
