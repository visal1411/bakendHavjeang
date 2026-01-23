import { useState, useEffect } from "react";
import { mockMechanics } from "@/data/mockData";

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
  initialMaxDistance = null
) => {
  const [mechanics, setMechanics] = useState([]);
  const [filteredMechanics, setFilteredMechanics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [maxDistance, setMaxDistance] = useState(initialMaxDistance);

  // Initialize mechanics on mount
  useEffect(() => {
    setTimeout(() => {
      setMechanics(mockMechanics);
      setFilteredMechanics(mockMechanics);
      setIsLoading(false);
    }, 800);
  }, []);

  // Filter mechanics based on search, category, and distance
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
          m.location.toLowerCase().includes(query)
      );
    }

    // Distance filter (zone-based)
    if (userLocation && maxDistance) {
      filtered = filtered.filter((m) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          m.lat,
          m.lng
        );
        return distance <= maxDistance;
      });
    }

    // Update distances for all filtered mechanics
    if (userLocation) {
      filtered = filtered.map((m) => ({
        ...m,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          m.lat,
          m.lng
        ),
      }));
      // Sort by distance
      filtered.sort((a, b) => a.distance - b.distance);
    }

    setFilteredMechanics(filtered);
  }, [searchQuery, selectedCategory, mechanics, userLocation, maxDistance]);

  const availableMechanics = filteredMechanics.filter((m) => m.available);

  return {
    mechanics,
    filteredMechanics,
    availableMechanics,
    isLoading,
    setMaxDistance,
  };
};
