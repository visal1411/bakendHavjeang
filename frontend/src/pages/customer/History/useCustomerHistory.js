import { useState, useEffect } from "react";
import { serviceRequestsService } from "@/services";

const parseAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

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

      // Transform API response to match History component expectations
      const transformedHistory = response.map((request) => {
        const tripFee = parseAmount(request.trip_price);
        const proposedPrice = parseAmount(request.proposed_price);
        const serviceItems = Array.isArray(request.service)
          ? request.service
          : [];
        const serviceFee = serviceItems.length
          ? serviceItems.reduce(
              (sum, service) => sum + parseAmount(service.price),
              0,
            )
          : proposedPrice;
        const totalAmount =
          parseAmount(request.total_price) || tripFee + serviceFee;
        const normalizedStatus = (request.status || "").toLowerCase();
        const canRespondToPriceChange =
          proposedPrice > 0 &&
          normalizedStatus === "proposed" &&
          request.customerApproved !== true;
        const canCancel = ["pending", "proposed", "accepted"].includes(
          normalizedStatus,
        );

        return {
          id: request.id,
          serviceDate: request.request_date,
          mechanicName: request.mechanic?.name || "Pending Assignment",
          mechanicPhone: request.mechanic?.phone || "",
          mechanicLocation: request.mechanic
            ? {
                lat: request.mechanic.mechanic_lat,
                lng: request.mechanic.mechanic_lng,
              }
            : null,
          serviceType: serviceItems.length
            ? serviceItems.map((service) => service.name).join(", ")
            : "Custom Service",
          status: request.status || "pending",
          location: request.address,
          tripFee,
          serviceFee,
          totalAmount,
          price: totalAmount,
          rating: null,
          notes: request.description,
          proposedPrice,
          customerApproved: request.customerApproved,
          lat: request.request_lat,
          lng: request.request_lng,
          canRespondToPriceChange,
          canCancel,
        };
      });

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
          req.id === requestId
            ? { ...req, status: "cancelled", canCancel: false }
            : req,
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
