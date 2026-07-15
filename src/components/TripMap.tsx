"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export type MapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isSecondary: boolean;
};

function markerIcon(isSecondary: boolean) {
  const color = isSecondary ? "#059669" : "#2563eb";
  return L.divIcon({
    className: "",
    html: `<div style="width:16px;height:16px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 2px rgba(0,0,0,0.5)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

const NAN_CENTER: [number, number] = [18.7756, 100.7714];

export function TripMap({ points }: { points: MapPoint[] }) {
  const center: [number, number] =
    points.length > 0
      ? [
          points.reduce((sum, p) => sum + p.lat, 0) / points.length,
          points.reduce((sum, p) => sum + p.lng, 0) / points.length,
        ]
      : NAN_CENTER;

  return (
    <MapContainer
      key={points.map((p) => p.id).join(",")}
      center={center}
      zoom={10}
      scrollWheelZoom={false}
      className="h-80 w-full rounded-xl"
      style={{ isolation: "isolate" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={markerIcon(p.isSecondary)}>
          <Popup>{p.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
