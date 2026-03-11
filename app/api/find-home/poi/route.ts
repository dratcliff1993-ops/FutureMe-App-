import { NextRequest, NextResponse } from 'next/server';

interface POIData {
  parks: number;
  pubs: number;
  restaurants: number;
  gyms: number;
  schools: number;
  museums: number;
  source: 'overpass' | 'error';
  lastUpdated: string;
}

// Overpass QL queries for each POI type
// Searches within 1km (0.009 degree approx) of given coordinates
const buildOverpassQuery = (lat: number, lng: number, poiType: string): string => {
  const bbox = `${lat - 0.009},${lng - 0.009},${lat + 0.009},${lng + 0.009}`;

  const queries: Record<string, string> = {
    parks: `
      [bbox:${bbox}];
      (
        node["leisure"="park"];
        way["leisure"="park"];
        relation["leisure"="park"];
        node["leisure"="nature_reserve"];
        way["leisure"="nature_reserve"];
      );
      out count;
    `,
    pubs: `
      [bbox:${bbox}];
      (
        node["amenity"="pub"];
        way["amenity"="pub"];
        node["amenity"="bar"];
        way["amenity"="bar"];
      );
      out count;
    `,
    restaurants: `
      [bbox:${bbox}];
      (
        node["amenity"="restaurant"];
        way["amenity"="restaurant"];
        node["amenity"="cafe"];
        way["amenity"="cafe"];
        node["amenity"="fast_food"];
        way["amenity"="fast_food"];
      );
      out count;
    `,
    gyms: `
      [bbox:${bbox}];
      (
        node["leisure"="fitness_centre"];
        way["leisure"="fitness_centre"];
        node["leisure"="gym"];
        way["leisure"="gym"];
      );
      out count;
    `,
    schools: `
      [bbox:${bbox}];
      (
        node["amenity"="school"];
        way["amenity"="school"];
        node["amenity"="kindergarten"];
        way["amenity"="kindergarten"];
      );
      out count;
    `,
    museums: `
      [bbox:${bbox}];
      (
        node["tourism"="museum"];
        way["tourism"="museum"];
        node["tourism"="gallery"];
        way["tourism"="gallery"];
      );
      out count;
    `,
  };

  return queries[poiType] || '';
};

async function fetchPOICount(lat: number, lng: number, poiType: string): Promise<number> {
  try {
    const query = buildOverpassQuery(lat, lng, poiType);
    const url = 'https://overpass-api.de/api/interpreter';

    const response = await fetch(url, {
      method: 'POST',
      body: `[out:json];${query}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!response.ok) {
      console.error(`Overpass API error for ${poiType}: ${response.status}`);
      return 0;
    }

    const data: { osm3s: { timestamp_osm_base: string }; elements: unknown[] } =
      await response.json();

    return data.elements?.length ?? 0;
  } catch (error) {
    console.error(`Error fetching POI count for ${poiType}:`, error);
    return 0;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Missing lat or lng parameter' },
        { status: 400 }
      );
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Fetch all POI types in parallel
    const [parks, pubs, restaurants, gyms, schools, museums] = await Promise.all([
      fetchPOICount(latNum, lngNum, 'parks'),
      fetchPOICount(latNum, lngNum, 'pubs'),
      fetchPOICount(latNum, lngNum, 'restaurants'),
      fetchPOICount(latNum, lngNum, 'gyms'),
      fetchPOICount(latNum, lngNum, 'schools'),
      fetchPOICount(latNum, lngNum, 'museums'),
    ]);

    const poiData: POIData = {
      parks,
      pubs,
      restaurants,
      gyms,
      schools,
      museums,
      source: 'overpass',
      lastUpdated: new Date().toISOString(),
    };

    // Cache for 7 days
    return NextResponse.json(poiData, {
      headers: {
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=2592000',
      },
    });
  } catch (error) {
    console.error('POI data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error', source: 'error' },
      { status: 500 }
    );
  }
}
