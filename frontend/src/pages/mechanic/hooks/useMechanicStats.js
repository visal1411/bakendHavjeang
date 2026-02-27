import { useState, useEffect } from "react";
import { serviceRequestsService } from "@/services";

/**
 * useMechanicStats Hook
 *
 * Manages mechanic statistics and performance metrics
 * Calculates stats from real service requests data
 */
export const useMechanicStats = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    completedJobs: 0,
    cancelledJobs: 0,
    rating: 0,
    totalReviews: 0,
    totalEarnings: 0,
    responseTime: "~0 min",
    completionRate: 0,
    availabilityHours: "Not set",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);

    try {
      // Fetch all service requests to calculate stats
      const requests = await serviceRequestsService.getIncomingRequests();

      // Calculate stats from requests
      const totalJobs = requests.length;
      const completedJobs = requests.filter(
        (req) => req.status === "completed"
      ).length;
      const cancelledJobs = requests.filter(
        (req) => req.status === "cancelled"
      ).length;

      const totalEarnings = requests
        .filter((req) => req.status === "completed")
        .reduce((sum, req) => sum + (req.total_price || 0), 0);

      const completionRate =
        totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(1) : 0;

      setStats({
        totalJobs,
        completedJobs,
        cancelledJobs,
        rating: 0, // TODO: Implement rating system
        totalReviews: 0, // TODO: Implement review system
        totalEarnings,
        responseTime: "~5 min", // TODO: Calculate from response times
        completionRate: parseFloat(completionRate),
        availabilityHours: "08:00 - 18:00", // TODO: Get from user profile
      });
    } catch (error) {
      console.error("Failed to fetch mechanic stats:", error);
      // Keep default empty stats
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStats = async () => {
    await fetchStats();
  };

  return {
    stats,
    isLoading,
    refreshStats,
  };
};
