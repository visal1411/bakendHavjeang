import { useState, useEffect } from "react";
import { mechanicStats } from "@/data/mockData";

/**
 * useMechanicStats Hook
 *
 * Manages mechanic statistics and performance metrics
 */
export const useMechanicStats = () => {
  const [stats, setStats] = useState(mechanicStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching mechanic stats from API
    const fetchStats = async () => {
      setIsLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setStats(mechanicStats);
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  const refreshStats = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStats(mechanicStats);
    setIsLoading(false);
  };

  return {
    stats,
    isLoading,
    refreshStats,
  };
};
