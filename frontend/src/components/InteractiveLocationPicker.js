import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng);
    },
  });
  return null;
};

const InteractiveLocationPicker = ({ coordinates, onCoordinatesChange, location }) => {
  const [position, setPosition] = useState(
    coordinates && coordinates.lat && coordinates.lng
      ? [coordinates.lat, coordinates.lng]
      : [34.0522, -118.2437] // Default to Los Angeles
  );
  const [hasMarker, setHasMarker] = useState(
    !!(coordinates && coordinates.lat && coordinates.lng)
  );

  const handleMapClick = (latlng) => {
    const newPosition = [latlng.lat, latlng.lng];
    setPosition(newPosition);
    setHasMarker(true);
    onCoordinatesChange({
      lat: latlng.lat,
      lng: latlng.lng
    });
  };

  const handleClearMarker = () => {
    setHasMarker(false);
    onCoordinatesChange(null);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
          <MapPin className="h-3 w-3" />
          Click map to set location
        </label>
        {hasMarker && (
          <button
            type="button"
            onClick={handleClearMarker}
            className="font-mono text-xs uppercase tracking-wider text-destructive hover:underline"
            data-testid="clear-marker-button"
          >
            Clear Pin
          </button>
        )}
      </div>

      <div className="h-80 border border-border" data-testid="interactive-map">
        <MapContainer
          center={position}
          zoom={hasMarker ? 11 : 4}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationSelect={handleMapClick} />
          {hasMarker && <Marker position={position} />}
        </MapContainer>
      </div>

      {hasMarker && (
        <div className="text-sm font-mono text-muted-foreground" data-testid="selected-coordinates">
          Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </div>
      )}

      <p className="text-xs text-muted-foreground font-sans">
        Click anywhere on the map to place a pin for this item's location. The pin will appear where you click.
      </p>
    </div>
  );
};

export default InteractiveLocationPicker;