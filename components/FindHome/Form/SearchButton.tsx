'use client';

import { dummyNeighborhoods } from '@/lib/data/dummyNeighborhoods';
import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';
import { scoreNeighborhoods, filterNeighborhoodsByConstraints } from '@/lib/utils/scoringEngine';

export default function SearchButton() {
  const {
    maxCommuteMins,
    maxHousePrice,
    minHousePrice,
    demographic,
    selectedCity,
    workplaceCoordinates,
    requiredPOIs,
    minPOICount,
    priorityCategories,
    commuteType,
    setFilteredNeighborhoods,
    setLoading,
    setError,
  } = useFindHomeStore();

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate a slight delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter neighborhoods by city
      let results = dummyNeighborhoods.filter((n) => n.city === selectedCity);

      // Apply hard constraints
      results = filterNeighborhoodsByConstraints(results, {
        maxCommuteMins,
        maxHousePrice,
        minHousePrice,
        requirePOIs: requiredPOIs.length > 0 ? requiredPOIs : undefined,
      });

      // Score remaining neighborhoods
      const scored = scoreNeighborhoods(results, {
        workplaceCoordinates,
        maxCommuteMins,
        commuteType,
        preferredScore: 70,
        priorityCategories,
        demographic,
        maxHousePrice,
        minHousePrice,
        requiredPOIs,
        minPOICount,
      });

      setFilteredNeighborhoods(scored as any);
    } catch (error) {
      setError('Failed to search neighborhoods. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSearch}
      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl transition shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      🔍 Find Neighborhoods
    </button>
  );
}
