// Pre-calculated livability scores and indices for neighborhoods
// These combine multiple factors into weighted scores

export interface LivabilityScore {
  neighborhoodId: string;
  overallScore: number; // 0-100
  categories: {
    walkability: number;
    safety: number;
    culture: number;
    greenSpace: number;
    nightlife: number;
    transit: number;
    affordability: number;
    family: number;
  };
  demographicFit: {
    young_professionals: number;
    families: number;
    retirees: number;
    students: number;
    mixed: number;
  };
}

export const livabilityScores: LivabilityScore[] = [
  {
    neighborhoodId: 'shoreditch',
    overallScore: 85,
    categories: {
      walkability: 95,
      safety: 72,
      culture: 92,
      greenSpace: 65,
      nightlife: 95,
      transit: 92,
      affordability: 65, // Higher house prices
      family: 58,
    },
    demographicFit: {
      young_professionals: 95,
      families: 45,
      retirees: 30,
      students: 88,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'clapham',
    overallScore: 82,
    categories: {
      walkability: 88,
      safety: 78,
      culture: 78,
      greenSpace: 85,
      nightlife: 82,
      transit: 85,
      affordability: 70,
      family: 85,
    },
    demographicFit: {
      young_professionals: 82,
      families: 88,
      retirees: 65,
      students: 70,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'wimbledon',
    overallScore: 80,
    categories: {
      walkability: 82,
      safety: 85,
      culture: 72,
      greenSpace: 92,
      nightlife: 65,
      transit: 78,
      affordability: 72,
      family: 92,
    },
    demographicFit: {
      young_professionals: 60,
      families: 95,
      retirees: 85,
      students: 45,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'islington',
    overallScore: 84,
    categories: {
      walkability: 92,
      safety: 74,
      culture: 85,
      greenSpace: 78,
      nightlife: 80,
      transit: 90,
      affordability: 68,
      family: 72,
    },
    demographicFit: {
      young_professionals: 88,
      families: 75,
      retirees: 62,
      students: 80,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'bethnal-green',
    overallScore: 81,
    categories: {
      walkability: 90,
      safety: 68,
      culture: 88,
      greenSpace: 72,
      nightlife: 88,
      transit: 91,
      affordability: 82, // More affordable
      family: 65,
    },
    demographicFit: {
      young_professionals: 90,
      families: 62,
      retirees: 40,
      students: 85,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'brixton',
    overallScore: 80,
    categories: {
      walkability: 88,
      safety: 70,
      culture: 90,
      greenSpace: 68,
      nightlife: 92,
      transit: 88,
      affordability: 80,
      family: 68,
    },
    demographicFit: {
      young_professionals: 85,
      families: 65,
      retirees: 55,
      students: 82,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'king-cross',
    overallScore: 83,
    categories: {
      walkability: 93,
      safety: 76,
      culture: 86,
      greenSpace: 80,
      nightlife: 85,
      transit: 95,
      affordability: 65,
      family: 70,
    },
    demographicFit: {
      young_professionals: 92,
      families: 68,
      retirees: 60,
      students: 85,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'camden',
    overallScore: 86,
    categories: {
      walkability: 91,
      safety: 72,
      culture: 94,
      greenSpace: 82,
      nightlife: 93,
      transit: 92,
      affordability: 64,
      family: 72,
    },
    demographicFit: {
      young_professionals: 94,
      families: 70,
      retirees: 50,
      students: 90,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'hackney',
    overallScore: 79,
    categories: {
      walkability: 87,
      safety: 71,
      culture: 89,
      greenSpace: 79,
      nightlife: 84,
      transit: 86,
      affordability: 81,
      family: 70,
    },
    demographicFit: {
      young_professionals: 88,
      families: 72,
      retirees: 55,
      students: 85,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'putney',
    overallScore: 79,
    categories: {
      walkability: 85,
      safety: 82,
      culture: 75,
      greenSpace: 88,
      nightlife: 70,
      transit: 82,
      affordability: 75,
      family: 88,
    },
    demographicFit: {
      young_professionals: 70,
      families: 90,
      retirees: 82,
      students: 50,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'central-manchester',
    overallScore: 78,
    categories: {
      walkability: 94,
      safety: 75,
      culture: 92,
      greenSpace: 75,
      nightlife: 94,
      transit: 93,
      affordability: 90, // Much more affordable than London
      family: 72,
    },
    demographicFit: {
      young_professionals: 92,
      families: 75,
      retirees: 68,
      students: 88,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'bristol-clifton',
    overallScore: 81,
    categories: {
      walkability: 89,
      safety: 80,
      culture: 88,
      greenSpace: 92,
      nightlife: 78,
      transit: 82,
      affordability: 85,
      family: 85,
    },
    demographicFit: {
      young_professionals: 85,
      families: 88,
      retirees: 78,
      students: 80,
      mixed: 50,
    },
  },
  {
    neighborhoodId: 'sevenoaks',
    overallScore: 79,
    categories: {
      walkability: 72,
      safety: 82,
      culture: 68,
      greenSpace: 88,
      nightlife: 50,
      transit: 75,
      affordability: 75,
      family: 82,
    },
    demographicFit: {
      young_professionals: 55,
      families: 80,
      retirees: 88,
      students: 50,
      mixed: 65,
    },
  },
  {
    neighborhoodId: 'tunbridge-wells',
    overallScore: 78,
    categories: {
      walkability: 70,
      safety: 85,
      culture: 72,
      greenSpace: 90,
      nightlife: 45,
      transit: 72,
      affordability: 78,
      family: 85,
    },
    demographicFit: {
      young_professionals: 50,
      families: 82,
      retirees: 90,
      students: 45,
      mixed: 65,
    },
  },
  {
    neighborhoodId: 'guildford',
    overallScore: 80,
    categories: {
      walkability: 75,
      safety: 80,
      culture: 75,
      greenSpace: 85,
      nightlife: 60,
      transit: 78,
      affordability: 76,
      family: 85,
    },
    demographicFit: {
      young_professionals: 70,
      families: 85,
      retirees: 80,
      students: 55,
      mixed: 70,
    },
  },
  {
    neighborhoodId: 'dorking',
    overallScore: 77,
    categories: {
      walkability: 68,
      safety: 83,
      culture: 65,
      greenSpace: 92,
      nightlife: 40,
      transit: 70,
      affordability: 78,
      family: 80,
    },
    demographicFit: {
      young_professionals: 45,
      families: 78,
      retirees: 88,
      students: 45,
      mixed: 62,
    },
  },
  {
    neighborhoodId: 'henley-on-thames',
    overallScore: 80,
    categories: {
      walkability: 74,
      safety: 84,
      culture: 76,
      greenSpace: 87,
      nightlife: 55,
      transit: 68,
      affordability: 80,
      family: 78,
    },
    demographicFit: {
      young_professionals: 72,
      families: 80,
      retirees: 82,
      students: 50,
      mixed: 70,
    },
  },
  {
    neighborhoodId: 'st-albans',
    overallScore: 79,
    categories: {
      walkability: 76,
      safety: 81,
      culture: 78,
      greenSpace: 80,
      nightlife: 58,
      transit: 82,
      affordability: 77,
      family: 88,
    },
    demographicFit: {
      young_professionals: 68,
      families: 90,
      retirees: 75,
      students: 60,
      mixed: 72,
    },
  },
];

export const getLivabilityScore = (neighborhoodId: string): LivabilityScore | undefined => {
  return livabilityScores.find(s => s.neighborhoodId === neighborhoodId);
};

export const getNeighborhoodsByScore = (minScore: number, maxScore: number = 100): LivabilityScore[] => {
  return livabilityScores.filter(s => s.overallScore >= minScore && s.overallScore <= maxScore);
};

export const getNeighborhoodsByDemographic = (demographic: keyof LivabilityScore['demographicFit'], minScore: number): LivabilityScore[] => {
  return livabilityScores.filter(s => s.demographicFit[demographic] >= minScore).sort((a, b) => b.demographicFit[demographic] - a.demographicFit[demographic]);
};

export const getNeighborhoodsByCategory = (category: keyof LivabilityScore['categories'], minScore: number): LivabilityScore[] => {
  return livabilityScores.filter(s => s.categories[category] >= minScore).sort((a, b) => b.categories[category] - a.categories[category]);
};

export const calculateAffordabilityIndex = (medianHousePrice: number): number => {
  // Normalize house price to 0-100 scale (inverse: higher price = lower affordability)
  // London average ~£650k, Bristol average ~£350k
  const maxPrice = 1000000; // £1M = 0 affordability
  const minPrice = 300000; // £300k = 100 affordability
  const normalized = Math.max(0, Math.min(100, ((maxPrice - medianHousePrice) / (maxPrice - minPrice)) * 100));
  return Math.round(normalized);
};
