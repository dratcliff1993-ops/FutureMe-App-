import { NextRequest, NextResponse } from 'next/server';

interface PoliceUKCrime {
  category: string;
  location_type: string;
  location: {
    latitude: string;
    longitude: string;
    street: {
      id: number;
      name: string;
    };
  };
  context: string;
  outcome_status: {
    category: string;
    date: string;
  } | null;
  persistent_id: string;
  id: number;
  month: string;
}

interface CrimeData {
  totalCrimes: number;
  safetyScore: number;
  source: 'police_uk' | 'error';
  lastUpdated: string;
}

// Aggregate crimes to a 0-100 safety score
// Inverse: more crimes = lower safety score
// Baseline: ~100 crimes per month in an area = score 50
const BASELINE_CRIMES = 100; // crimes per month

function calculateSafetyScore(crimeCount: number): number {
  // Logarithmic scale to avoid extreme values
  // 0 crimes = 100, 100 crimes = 50, 1000 crimes = 0
  if (crimeCount === 0) return 100;

  const ratio = crimeCount / BASELINE_CRIMES;
  const logRatio = Math.log(ratio + 1); // +1 to handle log(1) = 0
  const score = Math.max(0, 100 - logRatio * 30); // ~30 point drop per log unit

  return Math.round(score);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const date = searchParams.get('date'); // YYYY-MM format

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Missing lat or lng parameter' },
        { status: 400 }
      );
    }

    // Use current month if not specified
    const queryDate = date || new Date().toISOString().slice(0, 7);

    // Call police.uk API
    // Fair use - ~3 neighborhood queries per search = ~36/day within limits
    const url = `https://data.police.uk/api/crimes-street/all-crime?lat=${lat}&lng=${lng}&date=${queryDate}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'FutureMe-App (https://future-me.io)',
      },
    });

    if (!response.ok) {
      console.error(`Police.uk API error: ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch crime data' },
        { status: response.status }
      );
    }

    const crimes: PoliceUKCrime[] = await response.json();
    const totalCrimes = crimes.length;
    const safetyScore = calculateSafetyScore(totalCrimes);

    const crimeData: CrimeData = {
      totalCrimes,
      safetyScore,
      source: 'police_uk',
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 24 hours
    return NextResponse.json(crimeData, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    console.error('Crime data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', source: 'error' },
      { status: 500 }
    );
  }
}
