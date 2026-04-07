import { useCallback, useEffect, useRef, useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

export function useGeolocation(initialCoordinates?: Coordinates) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(initialCoordinates ?? null);
  const [isLocating, setIsLocating] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Seu navegador nao oferece suporte a geolocalizacao.");
      return null;
    }

    setIsLocating(true);
    setError(null);

    return new Promise<Coordinates | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nextCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setCoordinates(nextCoordinates);
          setIsLocating(false);
          resolve(nextCoordinates);
        },
        () => {
          setError("Nao foi possivel obter sua localizacao atual.");
          setIsLocating(false);
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        },
      );
    });
  }, []);

  const startTracking = useCallback(
    (onUpdate?: (nextCoordinates: Coordinates) => void) => {
      if (!navigator.geolocation) {
        setError("Seu navegador nao oferece suporte a geolocalizacao.");
        return;
      }

      stopTracking();
      setError(null);
      setIsTracking(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const nextCoordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setCoordinates(nextCoordinates);
          onUpdate?.(nextCoordinates);
        },
        () => {
          setError("Nao foi possivel acompanhar sua localizacao em tempo real.");
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 15000,
        },
      );
    },
    [stopTracking],
  );

  useEffect(() => stopTracking, [stopTracking]);

  return {
    coordinates,
    setCoordinates,
    isLocating,
    isTracking,
    error,
    requestLocation,
    startTracking,
    stopTracking,
  };
}
