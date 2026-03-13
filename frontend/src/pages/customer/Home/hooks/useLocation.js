import { useState, useEffect } from "react";

/**
 * 📍 useLocation Hook
 *
 * Manages user's geolocation with permission handling and fallback strategies.
 * Automatically requests location on mount and provides retry functionality.
 *
 * @returns {Object} Location state and methods
 * @property {Array<number>|null} userLocation - [latitude, longitude] or null
 * @property {string} locationPermission - 'pending' | 'granted' | 'denied'
 * @property {boolean} isLoading - Loading state for location fetch
 * @property {Function} retryLocation - Retry location request after denial
 *
 * @example
 * const { userLocation, locationPermission, retryLocation } = useLocation();
 * if (locationPermission === 'denied') {
 *   return <button onClick={retryLocation}>Enable Location</button>;
 * }
 */
export const useLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);

  const FALLBACK_LOCATION = [11.5564, 104.9282]; // Phnom Penh center

  useEffect(() => {
    let isMounted = true;
    let watchId = null;

    const requestLocation = () => {
      if (!("geolocation" in navigator)) {
        handleLocationDenied();
        return;
      }

      // First try to get current position
      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          if (!isMounted) return;

          const userPos = [position.coords.latitude, position.coords.longitude];
          setUserLocation(userPos);
          setLocationPermission("granted");
          setIsLoading(false);

          // Start watching position for live updates
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              if (!isMounted) return;
              const newPos = [
                position.coords.latitude,
                position.coords.longitude,
              ];
              setUserLocation(newPos);
            },
            (error) => {
              console.warn("Watch position error:", error.code, error.message);
            },
            {
              enableHighAccuracy: true,
              maximumAge: 5000,
              timeout: 10000,
            },
          );
        },
        // Error callback
        (error) => {
          if (!isMounted) return;

          handleLocationDenied();
        },
        // Options
        {
          enableHighAccuracy: true, // Request GPS
          timeout: 15000, // 15 second timeout (longer for mobile)
          maximumAge: 0, // Don't use cached position
        },
      );
    };

    const handleLocationDenied = () => {
      if (!isMounted) return;
      setLocationPermission("denied");
      // Still set fallback location so map can work
      setUserLocation(FALLBACK_LOCATION);
      setIsLoading(false);
    };

    // Request immediately
    requestLocation();

    return () => {
      isMounted = false;
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const retryLocation = () => {
    setLocationPermission("pending");
    setIsLoading(true);

    if (!("geolocation" in navigator)) {
      alert("Your device does not support location services.");
      setIsLoading(false);
      return;
    }

    // Direct request to trigger native prompt
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPos = [position.coords.latitude, position.coords.longitude];
        setUserLocation(userPos);
        setLocationPermission("granted");
        setIsLoading(false);
      },
      (error) => {
        setLocationPermission("denied");
        setUserLocation(FALLBACK_LOCATION);
        setIsLoading(false);

        // Show user-friendly error message
        showLocationError(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const showLocationError = (error) => {
    let message = "";

    if (error.code === 1) {
      // Permission denied
      message =
        "Location permission denied.\n\n" +
        "📍 How to enable:\n" +
        "1. Click the lock icon (🔒) in the address bar\n" +
        "2. Find 'Location' setting\n" +
        "3. Change to 'Allow'\n" +
        "4. Reload the page\n\n" +
        "Chrome: chrome://settings/content/location\n" +
        "Safari: Settings → Safari → Location Services";
    } else if (error.code === 2) {
      // Position unavailable
      message =
        "GPS signal unavailable.\n\n" +
        "💡 Try:\n" +
        "• Move outdoors or near a window\n" +
        "• Enable Location Services in device settings\n" +
        "• Check if WiFi/GPS is enabled";
    } else if (error.code === 3) {
      // Timeout
      message =
        "Location request timed out.\n\n" +
        "Please check your internet connection and try again.";
    }

    if (message) {
      alert(message);
    }
  };

  return {
    userLocation,
    locationPermission,
    isLoading,
    retryLocation,
  };
};
