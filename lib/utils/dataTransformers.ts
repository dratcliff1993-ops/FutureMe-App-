import { Neighborhood, dummyNeighborhoods } from '../data/dummyNeighborhoods';
import { dummyWorkplaces } from '../data/dummyWorkplaces';
import { dummyPOI } from '../data/dummyPOI';
import { getLivabilityScore } from '../data/livabilityScores';

/**
 * Transform neighborhood data for map display
 */
export const transformNeighborhoodForMap = (neighborhood: Neighborhood) => {
  return {
    id: neighborhood.id,
    name: neighborhood.name,
    city: neighborhood.city,
    coordinates: neighborhood.coordinates,
    label: neighborhood.name,
    type: 'neighborhood' as const,
    color: '#3b82f6', // Blue for neighborhoods
  };
};

/**
 * Transform multiple neighborhoods for map display
 */
export const transformNeighborhoodsForMap = (neighborhoods: Neighborhood[]) => {
  return neighborhoods.map(transformNeighborhoodForMap);
};

/**
 * Transform workplace data for map display
 */
export const transformWorkplaceForMap = (workplace: typeof dummyWorkplaces[0]) => {
  return {
    id: workplace.id,
    name: workplace.name,
    coordinates: workplace.coordinates,
    label: workplace.name,
    type: 'workplace' as const,
    color: '#ef4444', // Red for workplaces
    industry: workplace.industry,
  };
};

/**
 * Transform POI data for map display
 */
export const transformPOIForMap = (poi: typeof dummyPOI[0]) => {
  const typeColors: Record<string, string> = {
    park: '#22c55e',
    pub: '#f59e0b',
    museum: '#8b5cf6',
    restaurant: '#ec4899',
    gym: '#06b6d4',
    school: '#f97316',
  };

  return {
    id: poi.id,
    name: poi.name,
    coordinates: poi.coordinates,
    label: poi.name,
    type: poi.type,
    color: typeColors[poi.type] || '#6b7280',
    rating: poi.rating,
  };
};

/**
 * Transform POIs for map display
 */
export const transformPOIsForMap = (pois: typeof dummyPOI) => {
  return pois.map(transformPOIForMap);
};

/**
 * Create a detailed neighborhood card object
 */
export const createNeighborhoodCardData = (neighborhood: Neighborhood) => {
  const livScore = getLivabilityScore(neighborhood.id);

  return {
    ...neighborhood,
    livabilityScore: livScore?.overallScore || 0,
    demographicFit: livScore?.demographicFit || {},
    pricePerSqm: Math.round(neighborhood.medianHousePrice / 100), // Rough estimate
    commuteTimes: {
      transit: neighborhood.averageCommute,
      car: Math.round(neighborhood.averageCommute * 0.75),
    },
  };
};

/**
 * Create neighborhood detail page data
 */
export const createNeighborhoodDetailData = (neighborhood: Neighborhood) => {
  const livScore = getLivabilityScore(neighborhood.id);
  const areaData = {
    populationDensity: neighborhood.populationDensity,
    medianHousePrice: neighborhood.medianHousePrice,
    yearOnYearPriceChange: Math.random() * 10 - 5, // Dummy: -5% to +5%
  };

  return {
    ...neighborhood,
    livability: livScore,
    areaData,
    demographics: {
      youngProfessionals: livScore?.demographicFit.young_professionals || 0,
      families: livScore?.demographicFit.families || 0,
      retirees: livScore?.demographicFit.retirees || 0,
      students: livScore?.demographicFit.students || 0,
    },
    topHighlights: neighborhood.highlights.slice(0, 4),
  };
};

/**
 * Prepare neighborhoods list with scoring for ranking
 */
export const prepareNeighborhoodsForRanking = (
  neighborhoods: Neighborhood[]
) => {
  return neighborhoods.map((n) => ({
    ...n,
    livabilityScore: getLivabilityScore(n.id)?.overallScore || 50,
  })).sort((a, b) => b.livabilityScore - a.livabilityScore);
};

/**
 * Filter neighborhoods by city
 */
export const getNeighborhoodsByCity = (city: string): Neighborhood[] => {
  return dummyNeighborhoods.filter((n) => n.city === city);
};

/**
 * Get all unique cities
 */
export const getAllCities = (): string[] => {
  const cities = new Set(dummyNeighborhoods.map((n) => n.city));
  return Array.from(cities).sort();
};

/**
 * Transform scores for visualization
 */
export const transformScoresForVisualization = (scores: Record<string, number>) => {
  return Object.entries(scores).map(([label, value]) => ({
    label: label.charAt(0).toUpperCase() + label.slice(1),
    value,
    percentage: value,
    color: getScoreColor(value),
  }));
};

/**
 * Get color based on score
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#22c55e'; // Green
  if (score >= 60) return '#3b82f6'; // Blue
  if (score >= 40) return '#f59e0b'; // Amber
  if (score >= 20) return '#ef4444'; // Red
  return '#6b7280'; // Gray
};

/**
 * Format neighborhood data for comparison
 */
export const createComparisonData = (neighborhoods: Neighborhood[]) => {
  return neighborhoods.map((n) => ({
    id: n.id,
    name: n.name,
    city: n.city,
    price: n.medianHousePrice,
    walkability: n.walkability,
    safety: n.safetyScore,
    culture: n.culturalScore,
    greenSpace: n.greenSpaceScore,
    nightlife: n.nightlifeScore,
    transit: n.transitscore,
    commute: n.averageCommute,
  }));
};

/**
 * Calculate statistics for a neighborhood set
 */
export const calculateNeighborhoodStats = (neighborhoods: Neighborhood[]) => {
  if (neighborhoods.length === 0) {
    return {
      avgPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      avgWalkability: 0,
      avgSafety: 0,
    };
  }

  const prices = neighborhoods.map((n) => n.medianHousePrice);
  const walkabilities = neighborhoods.map((n) => n.walkability);
  const safeties = neighborhoods.map((n) => n.safetyScore);

  return {
    avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    avgWalkability: Math.round(walkabilities.reduce((a, b) => a + b, 0) / walkabilities.length),
    avgSafety: Math.round(safeties.reduce((a, b) => a + b, 0) / safeties.length),
    count: neighborhoods.length,
  };
};

/**
 * Prepare data for neighborhood comparison chart
 */
export const prepareComparisonChartData = (neighborhoods: Neighborhood[]) => {
  return {
    labels: neighborhoods.map((n) => n.name),
    datasets: [
      {
        label: 'Walkability',
        data: neighborhoods.map((n) => n.walkability),
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
      },
      {
        label: 'Safety',
        data: neighborhoods.map((n) => n.safetyScore),
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: 'rgb(34, 197, 94)',
      },
      {
        label: 'Culture',
        data: neighborhoods.map((n) => n.culturalScore),
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        borderColor: 'rgb(168, 85, 247)',
      },
    ],
  };
};
