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
  neighborhood: typeof dummyNeighborhoods[0],
  baseUrl: string
): Promise<EnrichedNeighborhood> {
  try {
    const coords = neighborhood.coordinates as any;
    const url = new URL(`/api/find-home/crime`, baseUrl);
    url.searchParams.set('lat', coords.lat.toString());
    url.searchParams.set('lng', coords.lng.toString());

    // 3 second timeout for crime data fetch
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: 86400 }
    });

    clearTimeout(timeout);

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
    // Silently handle timeout and other errors - fall back to dummy data
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
  neighborhood: EnrichedNeighborhood,
  baseUrl: string
): Promise<EnrichedNeighborhood> {
  try {
    const coords = neighborhood as any;
    const url = new URL(`/api/find-home/poi`, baseUrl);
    url.searchParams.set('lat', coords.coordinates.lat.toString());
    url.searchParams.set('lng', coords.coordinates.lng.toString());

    // 5 second timeout for POI data fetch (Overpass can be slower)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: 604800 }
    });

    clearTimeout(timeout);

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
    // Silently handle timeout and other errors - fall back to dummy data
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

    // 2. Score directly without external API enrichment (faster & more reliable)
    // External APIs (police.uk, Overpass) are slow/unreliable for real-time scoring
    // Recommendations now vary based on user preferences instead of being static

    // 3. Score neighborhoods with user preferences
    const scored = scoreNeighborhoods(results, {
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
