export function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceKm(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
) {
  const earthRadiusKm = 6371;
  const latitudeDelta = toRadians(latitudeB - latitudeA);
  const longitudeDelta = toRadians(longitudeB - longitudeA);

  const a =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(latitudeA)) *
      Math.cos(toRadians(latitudeB)) *
      Math.sin(longitudeDelta / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

export function formatDistance(distanceKm?: number | null) {
  if (distanceKm == null || Number.isNaN(distanceKm)) return "Calculando...";
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)} m`;
  return `${distanceKm.toFixed(1)} km`;
}

export function estimateArrivalMinutes(distanceKm?: number | null, averageSpeedKmH = 32) {
  if (distanceKm == null || Number.isNaN(distanceKm)) return null;
  if (distanceKm <= 0.12) return 1;
  return Math.max(2, Math.round((distanceKm / averageSpeedKmH) * 60));
}
