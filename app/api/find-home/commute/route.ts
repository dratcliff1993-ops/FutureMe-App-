import { NextRequest, NextResponse } from 'next/server';

interface CommuteData {
  durationMins: number;
  distanceKm: number;
  mode: string;
  source: 'openrouteservice' | 'heuristic';
  lastUpdated: string;
}

// Mode mapping for OpenRouteService profiles
const getModeProfile = (mode: 'walk' | 'bike' | 'car' | 'transit' | 'flexible'): string => {
  const profiles: Record<string, string> = {
    walk: 'foot-walking',
    bike: 'cycling-regular',
    car: 'driving-car',
    transit: 'driving-car', // Fallback to car for transit (TfL not in free tier)
    flexible: 'driving-car', // Flexible defaults to car
  };
  return profiles[mode] || 'driving-car';
};

// Fallback Haversine + mode multiplier for when ORS fails
function estimateCommuteHeuristic(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  mode: string
): { durationMins: number; distanceKm: number } {
  // Calculate distance
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const lon1 = from.lng * Math.PI / 180;
  const lon2 = to.lng * Math.PI / 180;

  const dlat = lat2 - lat1;
  const dlon = lon2 - lon1;

  const a = Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));
  const distanceKm = c * 6371;

  // Mode multipliers (mins per km)
  const multipliers: Record<string, number> = {
    walk: 12,
    bike: 4,
    car: 1.5,
    transit: 2,
    flexible: 1.75,
  };

  const multiplier = multipliers[mode] || 1.75;
  const durationMins = Math.round(distanceKm * multiplier);

  return { durationMins, distanceKm: Math.round(distanceKm * 10) / 10 };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fromLat = searchParams.get('fromLat');
    const fromLng = searchParams.get('fromLng');
    const toLat = searchParams.get('toLat');
    const toLng = searchParams.get('toLng');
    const mode = searchParams.get('mode') || 'car';

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return NextResponse.json(
        { error: 'Missing coordinates (fromLat, fromLng, toLat, toLng)' },
        { status: 400 }
      );
    }

    const from = { lat: parseFloat(fromLat), lng: parseFloat(fromLng) };
    const to = { lat: parseFloat(toLat), lng: parseFloat(toLng) };

    if (isNaN(from.lat) || isNaN(from.lng) || isNaN(to.lat) || isNaN(to.lng)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTESERVICE_API_KEY;

    // If no API key, use heuristic
    if (!apiKey) {
      const heuristic = estimateCommuteHeuristic(from, to, mode);
      return NextResponse.json(
        {
          ...heuristic,
          mode,
          source: 'heuristic',
          lastUpdated: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    // Call OpenRouteService
    const profile = getModeProfile(mode as any);
    const url = `https://api.openrouteservice.org/v2/directions/${profile}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        coordinates: [
          [from.lng, from.lat],
          [to.lng, to.lat],
        ],
      }),
    });

    if (!response.ok) {
      console.error(`OpenRouteService error: ${response.status}`);
      // Fallback to heuristic
      const heuristic = estimateCommuteHeuristic(from, to, mode);
      return NextResponse.json(
        {
          ...heuristic,
          mode,
          source: 'heuristic',
          lastUpdated: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    const data: any = await response.json();
    const route = data.routes?.[0];

    if (!route) {
      const heuristic = estimateCommuteHeuristic(from, to, mode);
      return NextResponse.json(
        {
          ...heuristic,
          mode,
          source: 'heuristic',
          lastUpdated: new Date().toISOString(),
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        }
      );
    }

    const durationMins = Math.round(route.duration / 60);
    const distanceKm = Math.round((route.distance / 1000) * 10) / 10;

    const commuteData: CommuteData = {
      durationMins,
      distanceKm,
      mode,
      source: 'openrouteservice',
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json(commuteData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Commute data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', source: 'error' },
      { status: 500 }
    );
  }
}
