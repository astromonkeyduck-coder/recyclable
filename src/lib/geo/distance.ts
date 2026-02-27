import type { Coordinates } from "@/lib/facilities/types";

const EARTH_RADIUS_MI = 3958.8;
const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function haversineDistance(
  a: Coordinates,
  b: Coordinates,
  unit: "miles" | "km" = "miles"
): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);

  const sinHalfLat = Math.sin(dLat / 2);
  const sinHalfLng = Math.sin(dLng / 2);

  const h =
    sinHalfLat * sinHalfLat +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * sinHalfLng * sinHalfLng;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  const r = unit === "miles" ? EARTH_RADIUS_MI : EARTH_RADIUS_KM;

  return Math.round(r * c * 100) / 100;
}

export function sortByDistance<T extends { coordinates: Coordinates }>(
  items: T[],
  from: Coordinates
): Array<T & { distanceMiles: number; distanceKm: number }> {
  return items
    .map((item) => ({
      ...item,
      distanceMiles: haversineDistance(from, item.coordinates, "miles"),
      distanceKm: haversineDistance(from, item.coordinates, "km"),
    }))
    .sort((a, b) => a.distanceMiles - b.distanceMiles);
}

export function filterByRadius<T extends { distanceMiles: number }>(
  items: T[],
  radiusMiles: number
): T[] {
  return items.filter((item) => item.distanceMiles <= radiusMiles);
}
