import { useEffect, useRef } from "react";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

type Point = {
  id: string;
  position: [number, number];
  label: string;
  tone?: "amber" | "sky" | "emerald";
};

const tones = {
  amber: "#fbbf24",
  sky: "#38bdf8",
  emerald: "#22c55e",
};

function markerIcon(tone: keyof typeof tones = "amber") {
  return L.divIcon({
    className: "altum-map-marker",
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-center;height:24px;width:24px;">
        <div style="position:absolute;inset:0;background:${tones[tone]};opacity:0.2;border-radius:9999px;animation:pulse-soft 2s infinite;"></div>
        <div style="position:relative;margin:auto;height:12px;width:12px;border-radius:9999px;background:${tones[tone]};border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function MapPanel({
  center,
  points,
  zoom = 12,
  connectPoints = false,
  className = "",
}: {
  center: LatLngExpression;
  points: Point[];
  zoom?: number;
  connectPoints?: boolean;
  className?: string;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: true,
    }).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    points.forEach((point) => {
      L.marker(point.position, { icon: markerIcon(point.tone) })
        .addTo(map)
        .bindPopup(point.label);
    });

    if (connectPoints && points.length >= 2) {
      L.polyline(
        points.map((point) => point.position),
        {
          color: "#fbbf24",
          weight: 3,
          opacity: 0.8,
          dashArray: "10 12",
        },
      ).addTo(map);
    }

    if (points.length > 1) {
      const bounds = L.latLngBounds(points.map((point) => point.position));
      map.fitBounds(bounds, {
        padding: [36, 36],
      });
    }

    return () => {
      map.remove();
    };
  }, [center, connectPoints, points, zoom]);

  return (
    <div className={`overflow-hidden rounded-[28px] border border-white/10 ${className}`}>
      <div ref={mapRef} className="h-[320px] w-full bg-zinc-900" />
    </div>
  );
}
