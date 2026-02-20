import { useState, useEffect } from "react";

/**
 * useAvailability Hook
 *
 * Manages mechanic availability status
 */
export const useAvailability = (initialAvailable = true) => {
  const [isAvailable, setIsAvailable] = useState(initialAvailable);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load availability from localStorage on mount
  useEffect(() => {
    const savedAvailability = localStorage.getItem("mechanic_availability");
    if (savedAvailability !== null) {
      setIsAvailable(savedAvailability === "true");
    }
  }, []);

  // Save availability to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("mechanic_availability", isAvailable.toString());
  }, [isAvailable]);

  const toggleAvailability = async () => {
    setIsUpdating(true);

    // Simulate API call to update availability
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsAvailable((prev) => !prev);
    setIsUpdating(false);

    return { success: true };
  };

  const setAvailability = async (available) => {
    setIsUpdating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsAvailable(available);
    setIsUpdating(false);

    return { success: true };
  };

  return {
    isAvailable,
    isUpdating,
    toggleAvailability,
    setAvailability,
  };
};
