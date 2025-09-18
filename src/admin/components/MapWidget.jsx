import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function MapWidget({ lat, lng, label="Selected Course" }) {
  const latNum = Number(lat), lngNum = Number(lng);
  if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
    return <div className="text-sm text-gray-500">No coordinates yet.</div>;
  }
  return (
    <div className="h-72 rounded overflow-hidden shadow border">
      <MapContainer center={[latNum, lngNum]} zoom={15} style={{ height:"100%", width:"100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latNum, lngNum]}>
          <Popup>{label}<br/>({latNum.toFixed(6)}, {lngNum.toFixed(6)})</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
