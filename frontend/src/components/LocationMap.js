import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const LocationMap = ({ coordinates, location, title }) => {
  if (!coordinates || !coordinates.lat || !coordinates.lng) {
    return (
      <div className="border border-border p-4 bg-secondary" data-testid="map-unavailable">
        <p className="font-mono text-xs text-muted-foreground">Map location not available</p>
      </div>
    );
  }

  const position = [coordinates.lat, coordinates.lng];

  return (
    <div className="h-64 border border-border" data-testid="location-map">
      <MapContainer
        center={position}
        zoom={11}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="font-sans">
              <strong className="font-mono text-sm">{title}</strong>
              <p className="text-xs text-muted-foreground mt-1">{location}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LocationMap;