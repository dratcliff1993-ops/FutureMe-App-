// Geospatial utility functions for distance, bounds, and geometric calculations

export interface LatLngBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export const calculateDistance = (
  from: LatLng,
  to: LatLng
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

/**
 * Calculate bearing (direction) from one point to another
 * Returns angle in degrees (0-360)
 */
export const calculateBearing = (from: LatLng, to: LatLng): number => {
  const lat1 = from.lat * Math.PI / 180;
  const lat2 = to.lat * Math.PI / 180;
  const lon1 = from.lng * Math.PI / 180;
  const lon2 = to.lng * Math.PI / 180;

  const dlon = lon2 - lon1;

  const y = Math.sin(dlon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon);
  const bearing = Math.atan2(y, x) * 180 / Math.PI;

  return (bearing + 360) % 360;
};

/**
 * Calculate the bounding box around a center point with given radius
 */
export const calculateBounds = (center: LatLng, radiusKm: number): LatLngBounds => {
  const latChange = (radiusKm / 6371) * (180 / Math.PI);
  const lngChange = (radiusKm / 6371) * (180 / Math.PI) / Math.cos(center.lat * Math.PI / 180);

  return {
    north: center.lat + latChange,
    south: center.lat - latChange,
    east: center.lng + lngChange,
    west: center.lng - lngChange,
  };
};

/**
 * Check if a point is within a bounding box
 */
export const isPointInBounds = (point: LatLng, bounds: LatLngBounds): boolean => {
  return (
    point.lat >= bounds.south &&
    point.lat <= bounds.north &&
    point.lng >= bounds.west &&
    point.lng <= bounds.east
  );
};

/**
 * Check if a point is within a radius of a center point
 */
export const isPointInRadius = (point: LatLng, center: LatLng, radiusKm: number): boolean => {
  return calculateDistance(center, point) <= radiusKm;
};

/**
 * Calculate the center point (centroid) of multiple points
 */
export const calculateCentroid = (points: LatLng[]): LatLng => {
  if (points.length === 0) {
    return { lat: 0, lng: 0 };
  }

  const sum = points.reduce(
    (acc, p) => ({
      lat: acc.lat + p.lat,
      lng: acc.lng + p.lng,
    }),
    { lat: 0, lng: 0 }
  );

  return {
    lat: sum.lat / points.length,
    lng: sum.lng / points.length,
  };
};

/**
 * Calculate the center and zoom level for a set of points
 */
export const calculateMapFit = (points: LatLng[]): { center: LatLng; zoom: number } => {
  if (points.length === 0) {
    return { center: { lat: 51.5074, lng: -0.1278 }, zoom: 12 }; // Default to London
  }

  const center = calculateCentroid(points);

  // Calculate the maximum distance from center to any point
  let maxDistance = 0;
  points.forEach((p) => {
    const dist = calculateDistance(center, p);
    if (dist > maxDistance) {
      maxDistance = dist;
    }
  });

  // Estimate zoom level based on distance
  // This is a rough estimate
  let zoom = 12;
  if (maxDistance < 1) zoom = 16;
  else if (maxDistance < 3) zoom = 15;
  else if (maxDistance < 8) zoom = 13;
  else if (maxDistance < 15) zoom = 12;
  else if (maxDistance < 30) zoom = 11;
  else zoom = 10;

  return { center, zoom };
};

/**
 * Check if a point is inside a polygon using ray casting algorithm
 */
export const isPointInPolygon = (
  point: LatLng,
  polygon: LatLng[]
): boolean => {
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
};

/**
 * Simplify a path by reducing the number of points
 */
export const simplifyPath = (points: LatLng[], tolerance: number = 0.0001): LatLng[] => {
  if (points.length <= 2) return points;

  const simplified: LatLng[] = [points[0]];

  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDistance(points[i], points[i - 1], points[i + 1]);
    if (d > tolerance) {
      simplified.push(points[i]);
    }
  }

  simplified.push(points[points.length - 1]);
  return simplified;
};

/**
 * Calculate perpendicular distance from a point to a line
 */
const perpendicularDistance = (point: LatLng, lineStart: LatLng, lineEnd: LatLng): number => {
  const a = Math.abs(
    (lineEnd.lng - lineStart.lng) * (lineStart.lat - point.lat) -
    (lineStart.lng - point.lng) * (lineEnd.lat - lineStart.lat)
  );
  const b = Math.sqrt(
    (lineEnd.lng - lineStart.lng) ** 2 +
    (lineEnd.lat - lineStart.lat) ** 2
  );
  return a / b;
};

/**
 * Format distance in human-readable format
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

/**
 * Estimate commute time based on distance and transport mode
 */
export const estimateCommuteTime = (
  distanceKm: number,
  mode: 'transit' | 'car' | 'bike' | 'walk' = 'transit'
): number => {
  switch (mode) {
    case 'transit':
      // Average 2 min/km (includes waiting, transfers)
      return Math.round(distanceKm * 2 + 5); // +5 for waiting
    case 'car':
      // Average 1.5 min/km (with traffic)
      return Math.round(distanceKm * 1.5);
    case 'bike':
      // Average 3 min/km
      return Math.round(distanceKm * 3);
    case 'walk':
      // Average 12 min/km
      return Math.round(distanceKm * 12);
    default:
      return Math.round(distanceKm * 2);
  }
};
