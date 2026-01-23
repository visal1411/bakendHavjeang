import { useState, useRef, useCallback } from "react";

// Cambodia geographic boundaries
const CAMBODIA_BOUNDS = {
  north: 14.7,
  south: 10.4,
  east: 107.6,
  west: 102.3,
};

const CAMBODIA_CENTER = [11.5564, 104.9282]; // Phnom Penh

/**
 * useMapControl Hook
 *
 * Manages Leaflet map state including center, zoom, and navigation.
 * Map is restricted to Cambodia boundaries.
 * Provides methods to focus on locations, mechanics, or recenter to user.
 *
 * @param {Array<number>} initialCenter - Initial map center [lat, lng]
 *
 * @returns {Object} Map control state and methods
 * @property {React.RefObject} mapRef - Ref to Leaflet map instance
 * @property {Array<number>} mapCenter - Current map center [lat, lng]
 * @property {number} mapZoom - Current zoom level (1-18)
 * @property {Object} bounds - Cambodia geographic boundaries
 * @property {Function} focusOnLocation - Focus map on specific coordinates
 * @property {Function} focusOnMechanic - Focus map on mechanic's location
 * @property {Function} recenterToUser - Recenter map to user's current location
 *
 * @example
 * const { mapRef, focusOnMechanic, recenterToUser, bounds } = useMapControl();
 * <button onClick={() => focusOnMechanic(mechanic)}>View on Map</button>
 */
export const useMapControl = (initialCenter = CAMBODIA_CENTER) => {
  const [mapCenter, setMapCenter] = useState(initialCenter);
  const [mapZoom, setMapZoom] = useState(14);
  const mapRef = useRef(null);

  const focusOnLocation = useCallback((location, zoom = 15) => {
    if (location) {
      setMapCenter(location);
      setMapZoom(zoom);
    }
  }, []);

  const focusOnMechanic = useCallback((mechanic) => {
    if (mechanic?.lat && mechanic?.lng) {
      setMapCenter([mechanic.lat, mechanic.lng]);
      setMapZoom(15);
    }
  }, []);

  const recenterToUser = useCallback(
    (userLocation) => {
      focusOnLocation(userLocation, 15);
    },
    [focusOnLocation]
  );

  return {
    mapRef,
    mapCenter,
    mapZoom,
    bounds: CAMBODIA_BOUNDS,
    focusOnLocation,
    focusOnMechanic,
    recenterToUser,
  };
};
