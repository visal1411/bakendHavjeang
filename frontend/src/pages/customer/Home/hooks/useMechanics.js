import { useState, useEffect } from "react";
import { serviceRequestsService } from "@/services";

// Service Zone Configuration (similar to Grab/PassApp)
const RECOMMENDED_ZONE_KM = 5; // Mechanics within 5km are recommended

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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

  // Initialize mechanics on mount
  useEffect(() => {
    const fetchMechanics = async () => {
      // Only fetch if we have user location
      if (!userLocation) {
        // Set empty arrays if no location available
        setMechanics([]);
        setFilteredMechanics([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await serviceRequestsService.getNearbyMechanics({
          lat: userLocation.lat,
          lng: userLocation.lng,
        });

        // Transform API response to match expected format
        const mechanicsWithDistance = response.map((mechanic) => ({
          id: mechanic.id,
          name: mechanic.name,
          lat: mechanic.mechanic_lat,
          lng: mechanic.mechanic_lng,
          distance: mechanic.distance,
          available: true, // You can add availability logic
          services: mechanic.services || [], // Services from backend
          location: mechanic.location || "Unknown", // You may need to geocode this
          phone: mechanic.phone,
        }));

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
  }, [userLocation]);

  // Filter mechanics based on search and category - ALWAYS SHOW FULL LIST
  useEffect(() => {
    let filtered = mechanics;

    // Category filter
    if (selectedCategory !== "all" && selectedCategory) {
      filtered = filtered.filter((m) => m.services.includes(selectedCategory));
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

    // Update distances for all filtered mechanics
    if (userLocation) {
      filtered = filtered.map((m) => ({
        ...m,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          m.lat,
          m.lng,
        ),
      }));
      // Sort by distance (closest first)
      filtered.sort((a, b) => a.distance - b.distance);

      // Categorize by service zone for visual emphasis
      // Mechanics within 5km get special visual treatment (larger cards, animations)
      const recommended = filtered.filter(
        (m) => m.distance <= RECOMMENDED_ZONE_KM,
      );
      const distant = filtered.filter((m) => m.distance > RECOMMENDED_ZONE_KM);

      setRecommendedMechanics(recommended);
      setDistantMechanics(distant);
    } else {
      // When no user location, show all mechanics as recommended (no distance calculation)
      setRecommendedMechanics(filtered);
      setDistantMechanics([]);
    }

    setFilteredMechanics(filtered);
  }, [searchQuery, selectedCategory, mechanics, userLocation, maxDistance]);

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
