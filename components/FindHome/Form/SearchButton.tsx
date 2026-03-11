'use client';

import { useFindHomeStore } from '@/lib/stores/useFindHomeStore';

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
      // Call orchestrator API to enrich with real data + score
      const response = await fetch('/api/find-home/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedCity,
          maxCommuteMins,
          commuteType,
          maxHousePrice,
          minHousePrice,
          workplaceCoordinates,
          requiredPOIs,
          minPOICount,
          priorityCategories,
          demographic,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Search failed');
      }

      const scored = await response.json();
      setFilteredNeighborhoods(scored);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to search neighborhoods. Please try again.'
      );
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
