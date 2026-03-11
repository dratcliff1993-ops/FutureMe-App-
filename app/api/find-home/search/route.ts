import { NextRequest, NextResponse } from 'next/server';
import { dummyNeighborhoods } from '@/lib/data/dummyNeighborhoods';
import { scoreNeighborhoods, filterNeighborhoodsByConstraints, ScoredNeighborhood } from '@/lib/utils/scoringEngine';

interface EnrichedNeighborhood {
  [key: string]: unknown;
  crimeData?: {
    totalCrimes: number;
    safetyScore: number;
    source: 'police_uk' | 'error';
  };
  realPoiCounts?: {
    parks: number;
    pubs: number;
    restaurants: number;
    gyms: number;
    schools: number;
    museums: number;
  };
  dataQuality: {
    crimeReal: boolean;
    poiReal: boolean;
  };
}

interface SearchRequest {
  selectedCity: string;
  maxCommuteMins: number;
  commuteType: 'transit' | 'car' | 'bike' | 'walk' | 'flexible';
  maxHousePrice: number;
  minHousePrice: number;
  workplaceCoordinates: { lat: number; lng: number } | null;
  requiredPOIs: string[];
  minPOICount: Record<string, number>;
  priorityCategories: Record<string, number>;
  demographic: string;
}

async function enrichWithCrimeData(
  neighborhood: typeof dummyNeighborhoods[0]
): Promise<EnrichedNeighborhood> {
  try {
    const coords = neighborhood.coordinates as any;
    const response = await fetch(
      `/api/find-home/crime?lat=${coords.lat}&lng=${coords.lng}`,
      { next: { revalidate: 86400 } } // 24h cache
    );

    if (response.ok) {
      const crimeData = await response.json();
      if (crimeData.source === 'police_uk') {
        return {
          ...neighborhood,
          crimeData: {
            totalCrimes: crimeData.totalCrimes,
            safetyScore: crimeData.safetyScore,
            source: 'police_uk',
          },
          dataQuality: {
            crimeReal: true,
            poiReal: false,
          },
        };
      }
    }
  } catch (error) {
    console.error(`Crime enrichment error for ${neighborhood.name}:`, error);
  }

  return {
    ...neighborhood,
    dataQuality: {
      crimeReal: false,
      poiReal: false,
    },
  };
}

async function enrichWithPOIData(
  neighborhood: EnrichedNeighborhood
): Promise<EnrichedNeighborhood> {
  try {
    const coords = neighborhood as any;
    const response = await fetch(
      `/api/find-home/poi?lat=${coords.coordinates.lat}&lng=${coords.coordinates.lng}`,
      { next: { revalidate: 604800 } } // 7d cache
    );

    if (response.ok) {
      const poiData = await response.json();
      if (poiData.source === 'overpass') {
        return {
          ...neighborhood,
          realPoiCounts: {
            parks: poiData.parks,
            pubs: poiData.pubs,
            restaurants: poiData.restaurants,
            gyms: poiData.gyms,
            schools: poiData.schools,
            museums: poiData.museums,
          },
          dataQuality: {
            ...neighborhood.dataQuality,
            poiReal: true,
          },
        };
      }
    }
  } catch (error) {
    console.error(
      `POI enrichment error for ${neighborhood.name}:`,
      error
    );
  }

  return neighborhood;
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();

    // Validate required fields
    if (!body.selectedCity) {
      return NextResponse.json(
        { error: 'Missing selectedCity' },
        { status: 400 }
      );
    }

    // 1. Filter neighborhoods by city and constraints
    let results = dummyNeighborhoods.filter((n) => n.city === body.selectedCity);

    results = filterNeighborhoodsByConstraints(results, {
      maxCommuteMins: body.maxCommuteMins,
      maxHousePrice: body.maxHousePrice,
      minHousePrice: body.minHousePrice,
      requirePOIs: body.requiredPOIs.length > 0 ? body.requiredPOIs : undefined,
    });

    // 2. Enrich with real data (crime + POI) in parallel
    // Rate limiting: only fetch top 12 results to respect API fair use
    const enrichmentPromises = results.slice(0, 12).map(async (neighborhood) => {
      let enriched = await enrichWithCrimeData(neighborhood as typeof dummyNeighborhoods[0]);
      enriched = await enrichWithPOIData(enriched);
      return enriched;
    });

    const enrichedResults = await Promise.all(enrichmentPromises);

    // 3. Score neighborhoods with enriched data
    const scored = scoreNeighborhoods(enrichedResults as any, {
      workplaceCoordinates: body.workplaceCoordinates,
      maxCommuteMins: body.maxCommuteMins,
      commuteType: body.commuteType,
      preferredScore: 70,
      priorityCategories: body.priorityCategories,
      demographic: body.demographic,
      maxHousePrice: body.maxHousePrice,
      minHousePrice: body.minHousePrice,
      requiredPOIs: body.requiredPOIs,
      minPOICount: body.minPOICount,
    });

    return NextResponse.json(scored, {
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Search orchestrator error:', error);
    return NextResponse.json(
      { error: 'Failed to search neighborhoods', details: String(error) },
      { status: 500 }
    );
  }
}
