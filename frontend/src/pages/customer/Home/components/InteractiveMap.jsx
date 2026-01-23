import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { createCustomIcon, userLocationIcon } from '../utils/mapIcons';

// Cambodia geographic boundaries
const CAMBODIA_BOUNDS = [
  [10.4, 102.3], // Southwest
  [14.7, 107.6]  // Northeast
];

/**
 * Map center updater component
 */
const MapCenterUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

/**
 * Interactive map component
 */
export const InteractiveMap = ({ 
  mapRef,
  mapCenter, 
  mapZoom, 
  userLocation, 
  mechanics, 
  onMechanicSelect 
}) => {
  return (
    <MapContainer
      ref={mapRef}
      center={mapCenter}
      zoom={mapZoom}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={true}
      maxBounds={CAMBODIA_BOUNDS}
      maxBoundsViscosity={0.8}
      minZoom={8}
      maxZoom={18}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapCenterUpdater center={mapCenter} zoom={mapZoom} />
      
      {userLocation && (
        <Marker position={userLocation} icon={userLocationIcon} />
      )}

      {mechanics.map((mechanic) => (
        <Marker
          key={mechanic.id}
          position={[mechanic.lat, mechanic.lng]}
          icon={createCustomIcon(mechanic.available)}
          eventHandlers={{
            click: () => mechanic.available && onMechanicSelect(mechanic),
          }}
        />
      ))}
    </MapContainer>
  );
};
