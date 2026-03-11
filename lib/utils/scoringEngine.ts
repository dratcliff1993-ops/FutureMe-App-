import { Neighborhood } from '../data/dummyNeighborhoods';
import { getLivabilityScore } from '../data/livabilityScores';
import { dummyPOI, getPOIsByAreaId } from '../data/dummyPOI';
import { getIsochrones, dummyIsochrones } from '../data/dummyIsochrones';

export interface ScoredNeighborhood extends Neighborhood {
  score: number;
  breakdown: {
    commute: number;
    livability: number;
    affordability: number;
    poiScore: number;
    demographicFit: number;
    budget: number;
  };
  reasoning: string[];
}

export interface ScoringWeights {
  commute: number;
  livability: number;
  affordability: number;
  poi: number;
  demographic: number;
  budget: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  commute: 20,
  livability: 25,
  affordability: 15,
  poi: 15,
  demographic: 15,
  budget: 10,
};

export const scoreNeighborhood = (
  neighborhood: Neighborhood,
  userPreferences: {
    workplaceCoordinates: { lat: number; lng: number } | null;
    maxCommuteMins: number;
    commuteType: 'transit' | 'car' | 'bike' | 'walk' | 'flexible';
    preferredScore: number;
    priorityCategories: Record<string, number>;
    demographic: string;
    maxHousePrice: number;
    minHousePrice: number;
    requiredPOIs: string[];
    minPOICount: Record<string, number>;
  },
  weights: ScoringWeights = DEFAULT_WEIGHTS
): ScoredNeighborhood => {
  const reasoning: string[] = [];

  // 1. Commute Score (0-100)
  let commuteScore = 100;
  if (userPreferences.workplaceCoordinates) {
    const estimatedCommute = estimateCommute(
      neighborhood.coordinates,
      userPreferences.workplaceCoordinates,
      userPreferences.commuteType
    );
    const maxCommute = userPreferences.maxCommuteMins;
    if (estimatedCommute > maxCommute) {
      commuteScore = Math.max(0, 100 - (estimatedCommute - maxCommute) * 2);
      reasoning.push(`Commute of ${estimatedCommute}min slightly exceeds preference of ${maxCommute}min (${userPreferences.commuteType})`);
    } else {
      commuteScore = 100 - (estimatedCommute / maxCommute) * 20;
      reasoning.push(`Commute time: ${estimatedCommute}min (${userPreferences.commuteType})`);
    }
  }

  // 2. Livability Score (0-100) - weighted by user priorities
  // Extract relevant weights from priorityCategories
  const walkWeight = userPreferences.priorityCategories.walkability || 60;
  const safetyWeight = userPreferences.priorityCategories.safety || 80;
  const cultureWeight = userPreferences.priorityCategories.culture || 60;
  const greenSpaceWeight = userPreferences.priorityCategories.greenSpace || 50;
  const nightlifeWeight = userPreferences.priorityCategories.nightlife || 50;

  // Normalize weights to sum to 1
  const totalWeight = walkWeight + safetyWeight + cultureWeight + greenSpaceWeight + nightlifeWeight;
  const normWalk = walkWeight / totalWeight;
  const normSafety = safetyWeight / totalWeight;
  const normCulture = cultureWeight / totalWeight;
  const normGreen = greenSpaceWeight / totalWeight;
  const normNightlife = nightlifeWeight / totalWeight;

  let livabilityScore =
    neighborhood.walkability * normWalk +
    neighborhood.safetyScore * normSafety +
    neighborhood.culturalScore * normCulture +
    neighborhood.greenSpaceScore * normGreen +
    neighborhood.nightlifeScore * normNightlife;
  livabilityScore = Math.round(livabilityScore);
  reasoning.push(`Livability: walkable (${neighborhood.walkability}), safe (${neighborhood.safetyScore})`);

  // 3. Affordability Score (0-100)
  let affordabilityScore = 0;
  if (userPreferences.maxHousePrice >= neighborhood.medianHousePrice) {
    affordabilityScore = 100 - ((neighborhood.medianHousePrice - userPreferences.minHousePrice) /
      (userPreferences.maxHousePrice - userPreferences.minHousePrice)) * 50;
    affordabilityScore = Math.min(100, Math.max(0, affordabilityScore));
    reasoning.push(`House price £${neighborhood.medianHousePrice.toLocaleString()} within budget`);
  } else {
    affordabilityScore = 0;
    reasoning.push(`House price £${neighborhood.medianHousePrice.toLocaleString()} exceeds budget`);
  }

  // 4. POI Score (0-100)
  let poiScore = 0;
  const areaPOIs = getPOIsByAreaId(neighborhood.areaId);
  const requiredPOIsPresent = userPreferences.requiredPOIs.filter((poi) => {
    const count = neighborhood.poiCounts[poi as keyof typeof neighborhood.poiCounts] || 0;
    return count >= (userPreferences.minPOICount[poi] || 0);
  });

  if (userPreferences.requiredPOIs.length === 0) {
    poiScore = 75 + (areaPOIs.length / 10);
    reasoning.push(`Good POI diversity (${areaPOIs.length} points of interest)`);
  } else if (requiredPOIsPresent.length === userPreferences.requiredPOIs.length) {
    poiScore = 100;
    reasoning.push(`All required POIs present`);
  } else {
    poiScore = (requiredPOIsPresent.length / userPreferences.requiredPOIs.length) * 100;
    reasoning.push(`${requiredPOIsPresent.length}/${userPreferences.requiredPOIs.length} required POIs`);
  }

  // 5. Demographic Fit (0-100)
  let demographicScore = 50;
  const livScore = getLivabilityScore(neighborhood.id);
  if (livScore) {
    const demographicFit = livScore.demographicFit[
      userPreferences.demographic as keyof typeof livScore.demographicFit
    ] || 50;
    demographicScore = demographicFit;
    reasoning.push(`Good fit for ${userPreferences.demographic} (${demographicScore})`);
  }

  // 6. Budget Constraint (hard filter)
  let budgetScore = 100;
  if (neighborhood.medianHousePrice > userPreferences.maxHousePrice) {
    budgetScore = 0;
    reasoning.push(`⚠️ Over budget (£${neighborhood.medianHousePrice.toLocaleString()})`);
  }

  // Calculate weighted score
  let totalScore = 0;
  if (budgetScore === 0) {
    totalScore = 0; // If over budget, score is 0
  } else {
    totalScore =
      (commuteScore * weights.commute +
        livabilityScore * weights.livability +
        affordabilityScore * weights.affordability +
        poiScore * weights.poi +
        demographicScore * weights.demographic +
        budgetScore * weights.budget) /
      Object.values(weights).reduce((a, b) => a + b, 0);
  }

  return {
    ...neighborhood,
    score: Math.round(totalScore),
    breakdown: {
      commute: Math.round(commuteScore),
      livability: Math.round(livabilityScore),
      affordability: Math.round(affordabilityScore),
      poiScore: Math.round(poiScore),
      demographicFit: Math.round(demographicScore),
      budget: Math.round(budgetScore),
    },
    reasoning,
  };
};

export const scoreNeighborhoods = (
  neighborhoods: Neighborhood[],
  userPreferences: Parameters<typeof scoreNeighborhood>[1],
  weights?: ScoringWeights
): ScoredNeighborhood[] => {
  return neighborhoods
    .map((n) => scoreNeighborhood(n, userPreferences, weights))
    .sort((a, b) => b.score - a.score);
};

const estimateCommute = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  commuteType: 'transit' | 'car' | 'bike' | 'walk' | 'flexible' = 'flexible'
): number => {
  const distance = calculateDistance(from, to);

  // Mode-specific multipliers (minutes per km)
  const multipliers: Record<string, number> = {
    walk: 12,      // ~5 km/h
    bike: 4,       // ~15 km/h
    car: 1.5,      // ~40 km/h with traffic
    transit: 2,    // ~30 km/h including stops/transfers
    flexible: 1.75 // average of transit and car
  };

  const multiplier = multipliers[commuteType] || multipliers.flexible;
  return Math.round(distance * multiplier);
};

const calculateDistance = (
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number => {
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const lon1 = from.lng * Math.PI / 180;
  const lon2 = to.lng * Math.PI / 180;

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a = Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  const r = 6371; // Earth's radius in km

  return c * r;
};

export const filterNeighborhoodsByConstraints = (
  neighborhoods: Neighborhood[],
  constraints: {
    maxCommuteMins?: number;
    maxHousePrice?: number;
    minHousePrice?: number;
    requirePOIs?: string[];
  }
): Neighborhood[] => {
  return neighborhoods.filter((n) => {
    if (constraints.maxHousePrice && n.medianHousePrice > constraints.maxHousePrice) {
      return false;
    }
    if (constraints.minHousePrice && n.medianHousePrice < constraints.minHousePrice) {
      return false;
    }
    if (constraints.requirePOIs && constraints.requirePOIs.length > 0) {
      const hasRequired = constraints.requirePOIs.every(
        (poi) => (n.poiCounts[poi as keyof typeof n.poiCounts] || 0) > 0
      );
      if (!hasRequired) {
        return false;
      }
    }
    return true;
  });
};
