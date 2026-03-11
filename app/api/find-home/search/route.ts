import { NextRequest, NextResponse } from 'next/server';
import { dummyNeighborhoods } from '@/lib/data/dummyNeighborhoods';
import { scoreNeighborhoods, filterNeighborhoodsByConstraints, ScoredNeighborhood } from '@/lib/utils/scoringEngine';

interface EnrichedNeighborhood {
  [key: string]: unknown;
  dataQuality: {
    crimeReal: boolean;
    poiReal: boolean;
    commuteReal: boolean;
  };
  _realCommuteTime?: number;
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
): Promise<{ safetyScore: number; crimeReal: boolean }> {
  try {
    const coords = neighborhood.coordinates as any;
    const url = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3002'}/api/find-home/crime?lat=${coords.lat}&lng=${coords.lng}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      const crimeData = await response.json();
      if (crimeData.source === 'police_uk') {
        return {
          safetyScore: crimeData.safetyScore,
          crimeReal: true,
        };
      }
    }
  } catch (error) {
    console.error('Crime data fetch failed:', error);
  }

  return {
    safetyScore: neighborhood.safetyScore,
    crimeReal: false,
  };
}

async function enrichWithPOIData(
  neighborhood: typeof dummyNeighborhoods[0]
): Promise<{
  parks: number;
  pubs: number;
  restaurants: number;
  gyms: number;
  schools: number;
  museums: number;
  poiReal: boolean;
}> {
  try {
    const coords = neighborhood.coordinates as any;
    const url = `${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3002'}/api/find-home/poi?lat=${coords.lat}&lng=${coords.lng}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      const poiData = await response.json();
      if (poiData.source === 'overpass') {
        return {
          parks: poiData.parks,
          pubs: poiData.pubs,
          restaurants: poiData.restaurants,
          gyms: poiData.gyms,
          schools: poiData.schools,
          museums: poiData.museums,
          poiReal: true,
        };
      }
    }
  } catch (error) {
    console.error('POI data fetch failed:', error);
  }

  return {
    parks: neighborhood.poiCounts.parks,
    pubs: neighborhood.poiCounts.pubs,
    restaurants: neighborhood.poiCounts.restaurants,
    gyms: neighborhood.poiCounts.gyms,
    schools: neighborhood.poiCounts.schools,
    museums: neighborhood.poiCounts.museums,
    poiReal: false,
  };
}

async function enrichWithCommuteData(
  neighborhood: typeof dummyNeighborhoods[0],
  workplaceCoords: { lat: number; lng: number } | null,
  commuteType: string
): Promise<{ durationMins: number; commuteReal: boolean }> {
  if (!workplaceCoords) {
    return {
      durationMins: neighborhood.averageCommute,
      commuteReal: false,
    };
  }

  try {
    const coords = neighborhood.coordinates as any;
    const baseUrl = process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3002';
    const url = `${baseUrl}/api/find-home/commute?fromLat=${coords.lat}&fromLng=${coords.lng}&toLat=${workplaceCoords.lat}&toLng=${workplaceCoords.lng}&mode=${commuteType}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (response.ok) {
      const commuteData = await response.json();
      return {
        durationMins: commuteData.durationMins,
        commuteReal: commuteData.source === 'openrouteservice',
      };
    }
  } catch (error) {
    console.error('Commute data fetch failed:', error);
  }

  return {
    durationMins: neighborhood.averageCommute,
    commuteReal: false,
  };
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

    // 2. Enrich with real data in parallel
    const enrichedNeighborhoods = await Promise.all(
      results.map(async (neighborhood) => {
        const [crimeResult, poiResult, commuteResult] = await Promise.all([
          enrichWithCrimeData(neighborhood),
          enrichWithPOIData(neighborhood),
          enrichWithCommuteData(neighborhood, body.workplaceCoordinates, body.commuteType),
        ]);

        return {
          ...neighborhood,
          safetyScore: crimeResult.safetyScore,
          poiCounts: {
            parks: poiResult.parks,
            pubs: poiResult.pubs,
            restaurants: poiResult.restaurants,
            gyms: poiResult.gyms,
            schools: poiResult.schools,
            museums: poiResult.museums,
          },
          dataQuality: {
            crimeReal: crimeResult.crimeReal,
            poiReal: poiResult.poiReal,
            commuteReal: commuteResult.commuteReal,
          },
          _realCommuteTime: commuteResult.durationMins, // Store for scoring override
        } as EnrichedNeighborhood;
      })
    );

    // 3. Score neighborhoods with real data
    const scored = scoreNeighborhoods(enrichedNeighborhoods as any, {
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
