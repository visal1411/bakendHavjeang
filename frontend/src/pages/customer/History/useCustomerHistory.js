import { useState, useEffect } from "react";
import { serviceRequestsService } from "@/services";


/**
 * useCustomerHistory Hook
 *
 * Fetches and manages customer service request history from backend
 */
export const useCustomerHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await serviceRequestsService.getMyRequests();

      // Transform API response to match expected format
      const transformedHistory = response.map((req) => ({
        id: req.id,
        date: req.request_date,
        mechanicName: req.mechanic?.name || "Pending Assignment",
        mechanicPhone: req.mechanic?.phone,
        mechanicRating: req.mechanic?.rating || 0,
        service: req.service?.map((s) => s.name).join(", ") || "Custom Service",
        status: req.status,
        location: req.address,
        tripPrice: req.trip_price,
        servicePrice: req.total_price - req.trip_price || 0,
        total: req.total_price || req.trip_price,
        proposedPrice: req.proposed_price,
        customerApproved: req.customerApproved,
        description: req.description,
        lat: req.request_lat,
        lng: req.request_lng,
      }));

      setHistory(transformedHistory);
    } catch (err) {
      console.error("Failed to fetch service history:", err);
      setError(err.message);
      // Set empty array on error
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const cancelRequest = async (requestId) => {
    try {
      await serviceRequestsService.cancelServiceRequest(requestId);

      // Update local state
      setHistory((prevHistory) =>
        prevHistory.map((req) =>
          req.id === requestId ? { ...req, status: "cancelled" } : req,
        ),
      );

      return { success: true, message: "Request cancelled successfully" };
    } catch (err) {
      console.error("Failed to cancel request:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to cancel request",
      };
    }
  };

  const acceptProposedPrice = async (requestId) => {
    try {
      await serviceRequestsService.acceptProposedPrice(requestId);

      // Update local state
      setHistory((prevHistory) =>
        prevHistory.map((req) =>
          req.id === requestId
            ? { ...req, customerApproved: true, status: "accepted" }
            : req,
        ),
      );

      return { success: true, message: "Price accepted successfully" };
    } catch (err) {
      console.error("Failed to accept price:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to accept price",
      };
    }
  };

  const declineProposedPrice = async (requestId) => {
    try {
      await serviceRequestsService.declineProposedPrice(requestId);

      // Update local state
      setHistory((prevHistory) =>
        prevHistory.map((req) =>
          req.id === requestId
            ? { ...req, customerApproved: false, status: "cancelled" }
            : req,
        ),
      );

      return { success: true, message: "Price declined" };
    } catch (err) {
      console.error("Failed to decline price:", err);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to decline price",
      };
    }
  };

  return {
    history,
    isLoading,
    error,
    refreshHistory: fetchHistory,
    cancelRequest,
    acceptProposedPrice,
    declineProposedPrice,
  };
};
