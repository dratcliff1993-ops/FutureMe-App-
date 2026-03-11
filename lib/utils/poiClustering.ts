import { POI } from '../data/dummyPOI';

export interface POICluster {
  id: string;
  type: POI['type'];
  center: { lat: number; lng: number };
  count: number;
  pois: POI[];
  radius: number; // in km
}

export interface POIStats {
  type: POI['type'];
  count: number;
  density: number; // per km²
  averageRating: number;
}

export const clusterPOIs = (pois: POI[], clusterRadiusKm: number = 0.5): POICluster[] => {
  if (pois.length === 0) return [];

  const clusters: POICluster[] = [];
  const assigned = new Set<string>();

  // Group by type first
  const byType = groupPOIsByType(pois);

  Object.entries(byType).forEach(([type, typePOIs]) => {
    const processedPOIs = new Set<string>();

    typePOIs.forEach((poi) => {
      if (processedPOIs.has(poi.id)) return;

      // Find nearby POIs of same type
      const nearby = typePOIs.filter(
        (p) =>
          !processedPOIs.has(p.id) &&
          calculateDistance(poi.coordinates, p.coordinates) <= clusterRadiusKm
      );

      // Calculate cluster center
      const center = calculateCenter(nearby.map((p) => p.coordinates));

      const cluster: POICluster = {
        id: `cluster-${type}-${clusters.length}`,
        type: poi.type,
        center,
        count: nearby.length,
        pois: nearby,
        radius: clusterRadiusKm,
      };

      clusters.push(cluster);

      nearby.forEach((p) => processedPOIs.add(p.id));
      assigned.add(poi.id);
    });
  });

  return clusters;
};

export const groupPOIsByType = (pois: POI[]): Record<string, POI[]> => {
  return pois.reduce(
    (acc, poi) => {
      if (!acc[poi.type]) {
        acc[poi.type] = [];
      }
      acc[poi.type].push(poi);
      return acc;
    },
    {} as Record<string, POI[]>
  );
};

export const calculatePOIStats = (pois: POI[], areaRadiusKm: number = 2): POIStats[] => {
  const grouped = groupPOIsByType(pois);

  return Object.entries(grouped).map(([type, typePOIs]) => ({
    type: type as POI['type'],
    count: typePOIs.length,
    density: typePOIs.length / (Math.PI * areaRadiusKm ** 2), // per km²
    averageRating: typePOIs.reduce((sum, p) => sum + (p.rating || 3.5), 0) / typePOIs.length,
  }));
};

export const filterPOIsByType = (pois: POI[], types: POI['type'][]): POI[] => {
  return pois.filter((p) => types.includes(p.type));
};

export const filterPOIsByRadius = (
  pois: POI[],
  centerPoint: { lat: number; lng: number },
  radiusKm: number
): POI[] => {
  return pois.filter((p) => calculateDistance(centerPoint, p.coordinates) <= radiusKm);
};

export const filterPOIsByRating = (pois: POI[], minRating: number): POI[] => {
  return pois.filter((p) => (p.rating || 0) >= minRating);
};

export const calculateDistance = (
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

export const calculateCenter = (points: { lat: number; lng: number }[]): { lat: number; lng: number } => {
  if (points.length === 0) {
    return { lat: 0, lng: 0 };
  }

  if (points.length === 1) {
    return points[0];
  }

  // Simple average (good enough for dummy data)
  const avgLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const avgLng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;

  return { lat: avgLat, lng: avgLng };
};

export const getNearestPOIs = (
  pois: POI[],
  centerPoint: { lat: number; lng: number },
  count: number = 5
): POI[] => {
  return pois
    .map((p) => ({
      ...p,
      distance: calculateDistance(centerPoint, p.coordinates),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count)
    .map(({ distance, ...rest }) => rest);
};
