import { useState, useEffect } from "react";

/**
 * useGeolocation Hook
 *
 * Gets the current mechanic's location for navigation purposes
 */
export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    const successHandler = (pos) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      });
      setIsLoading(false);
    };

    const errorHandler = (err) => {
      setError(err.message);
      setIsLoading(false);
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler);

    // Watch position for real-time updates
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, error, isLoading };
};
