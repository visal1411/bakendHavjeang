import { useState, useEffect } from "react";
import { serviceRequestsService } from "@/services";

// Service Zone Configuration (similar to Grab/PassApp)
const RECOMMENDED_ZONE_KM = 5; // Mechanics within 5km are recommended

/**
 * useMechanics Hook
 *
 * Manages mechanics data with real-time filtering by search query, category, and distance.
 * Automatically loads mock data and provides filtered/available mechanics lists.
 *
 * @param {string} searchQuery - Search text to filter mechanics by name/location/services
 * @param {string} selectedCategory - Category ID to filter (or 'all' for no filter)
 * @param {Object} userLocation - User's current location { lat, lng }
 * @param {number} maxDistance - Maximum distance in km (default: null for no limit)
 *
 * @returns {Object} Mechanics data and loading state
 * @property {Array} mechanics - All mechanics (unfiltered)
 * @property {Array} filteredMechanics - Filtered by search + category + distance
 * @property {Array} availableMechanics - Only available mechanics from filtered list
 * @property {boolean} isLoading - Loading state for initial data fetch
 * @property {Function} setMaxDistance - Update max distance filter
 *
 * @example
 * const { filteredMechanics, isLoading, setMaxDistance } = useMechanics(searchQuery, 'tire', userLocation, 5);
 */
export const useMechanics = (
  searchQuery,
  selectedCategory,
  userLocation = null,
  initialMaxDistance = null,
) => {
  const [mechanics, setMechanics] = useState([]);
  const [filteredMechanics, setFilteredMechanics] = useState([]);
  const [recommendedMechanics, setRecommendedMechanics] = useState([]);
  const [distantMechanics, setDistantMechanics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxDistance, setMaxDistance] = useState(initialMaxDistance);

  const [userLat, userLng] = Array.isArray(userLocation)
    ? userLocation
    : [userLocation?.lat, userLocation?.lng];

  const hasValidUserLocation =
    typeof userLat === "number" &&
    Number.isFinite(userLat) &&
    typeof userLng === "number" &&
    Number.isFinite(userLng);

  // Initialize mechanics on mount
  useEffect(() => {
    const fetchMechanics = async () => {
      // Only fetch if we have user location
      if (!hasValidUserLocation) {
        // Set empty arrays if no location available
        setMechanics([]);
        setFilteredMechanics([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await serviceRequestsService.getNearbyMechanics({
          lat: userLat,
          lng: userLng,
        });

        // Transform API response to match expected format
        const mechanicsWithDistance = response.map((mechanic) => {
          const mechanicLat = Number(mechanic.mechanic_lat);
          const mechanicLng = Number(mechanic.mechanic_lng);
          const hasMechanicCoordinates =
            Number.isFinite(mechanicLat) && Number.isFinite(mechanicLng);

          const tripPrice = mechanic.trip_price ?? null;
          const numericTripPrice =
            tripPrice !== null ? Number(tripPrice) : null;
          const fallbackLocation = hasMechanicCoordinates
            ? `${mechanicLat.toFixed(6)}, ${mechanicLng.toFixed(6)}`
            : "Unknown";

          return {
            id: mechanic.id,
            name: mechanic.name,
            lat: hasMechanicCoordinates ? mechanicLat : null,
            lng: hasMechanicCoordinates ? mechanicLng : null,
            distance: Number(mechanic.distance),
            trip_price: numericTripPrice,
            rating: 4.5,
            totalReviews: 0,
            available: true,
            services: Array.isArray(mechanic.services)
              ? mechanic.services.map((s) =>
                  typeof s === "string" ? s : s.name,
                )
              : [],
            serviceTypes: Array.isArray(mechanic.services)
              ? mechanic.services.map((s) =>
                  typeof s === "string" ? s : s.serviceType,
                )
              : [],
            location: mechanic.location || fallbackLocation,
            phone: mechanic.phone,
          };
        });

        setMechanics(mechanicsWithDistance);
        setFilteredMechanics(mechanicsWithDistance);
      } catch (error) {
        console.error("Failed to fetch mechanics:", error);
        // Set empty arrays on error
        setMechanics([]);
        setFilteredMechanics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMechanics();
  }, [hasValidUserLocation, userLat, userLng]);

  // Filter mechanics based on search and category - ALWAYS SHOW FULL LIST
  useEffect(() => {
    let filtered = mechanics;

    // Category filter
    if (selectedCategory !== "all" && selectedCategory) {
      filtered = filtered.filter(
        (m) =>
          (m.serviceTypes || []).includes(selectedCategory) ||
          m.services.some((s) =>
            s.toLowerCase().includes(selectedCategory.toLowerCase()),
          ),
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.services.some((s) => s.toLowerCase().includes(query)) ||
          m.location.toLowerCase().includes(query),
      );
    }

    // NOTE: NO DISTANCE FILTERING - Always show full list regardless of distance
    // This ensures all mechanics are visible to customers at all times

    // Backend already calculated distances via ORS - just sort by it
    // Sort by distance (closest first)
    filtered.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    // Categorize by service zone for visual emphasis
    // Mechanics within 5km get special visual treatment (larger cards, animations)
    const recommended = filtered.filter(
      (m) => m.distance !== null && m.distance <= RECOMMENDED_ZONE_KM,
    );
    const distant = filtered.filter(
      (m) => m.distance === null || m.distance > RECOMMENDED_ZONE_KM,
    );

    setRecommendedMechanics(recommended);
    setDistantMechanics(distant);
    setFilteredMechanics(filtered);
  }, [searchQuery, selectedCategory, mechanics, maxDistance]);

  const availableMechanics = filteredMechanics.filter((m) => m.available);

  return {
    mechanics,
    filteredMechanics,
    availableMechanics,
    recommendedMechanics,
    distantMechanics,
    isLoading,
    setMaxDistance,
    RECOMMENDED_ZONE_KM,
  };
};
