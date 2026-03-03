import { useState, useEffect } from "react";
import { serviceRequestsService } from "@/services";

/**
 * useServiceRequests Hook
 *
 * Manages service requests for mechanic dashboard
 */
export const useServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, accepted, in-progress, completed, cancelled

  useEffect(() => {
    // Fetch service requests from API
    const fetchRequests = async () => {
      setIsLoading(true);

      try {
        const response = await serviceRequestsService.getIncomingRequests();

        // Transform API response to match expected format
        const transformedRequests = response.map((req) => ({
          id: req.id,
          customer: req.customer?.name || "Unknown",
          location: req.address,
          distance: req.distance || 0,
          service:
            req.service?.map((s) => s.name).join(", ") || "Unknown Service",
          status: req.status,
          tripPrice: req.trip_price,
          totalPrice: req.total_price,
          proposedPrice: req.proposed_price,
          description: req.description,
          lat: req.request_lat,
          lng: req.request_lng,
          createdAt: req.request_date,
          customerApproved: req.customerApproved,
        }));

        setRequests(transformedRequests);
      } catch (error) {
        console.error("Failed to fetch service requests:", error);
        setRequests([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Filter requests based on status
  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true;
    if (filter === "in-progress") {
      return request.status === "in-progress" || request.status === "in_progress";
    }
    return request.status === filter;
  });

  // Get counts by status
  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    inProgress: requests.filter(
      (r) => r.status === "in-progress" || r.status === "in_progress"
    ).length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length
  };

  const acceptRequest = async (requestId) => {
    try {
      const response =
        await serviceRequestsService.acceptServiceRequest(requestId);

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "accepted",
                acceptedAt: new Date().toISOString(),
              }
            : req,
        ),
      );

      return { success: true, message: "Request accepted successfully" };
    } catch (error) {
      console.error("Failed to accept request:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to accept request",
      };
    }
  };

  const declineRequest = async (requestId) => {
    try {
      const response =
        await serviceRequestsService.rejectServiceRequest(requestId);

      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId),
      );

      return { success: true, message: "Request declined" };
    } catch (error) {
      console.error("Failed to decline request:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to decline request",
      };
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      let response;

      if (newStatus === "completed") {
        response =
          await serviceRequestsService.completeServiceRequest(requestId);
      } else {
        // Handle other status updates if needed
        console.warn("Status update not yet implemented for:", newStatus);
        return { success: false, message: "Status update not supported" };
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, status: newStatus } : req,
        ),
      );

      return {
        success: true,
        message: `Request status updated to ${newStatus}`,
      };
    } catch (error) {
      console.error("Failed to update request status:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update status",
      };
    }
  };

  const refreshRequests = async () => {
    setIsLoading(true);
    try {
      const response = await serviceRequestsService.getIncomingRequests();
      const transformedRequests = response.map((req) => ({
        id: req.id,
        customerName: req.customer?.name || "Unknown Customer",
        customerPhone: req.customer?.phone,
        serviceType: req.service?.[0]?.serviceType || "unknown",
        status: req.status,
        location: req.address,
        distance: req.distance || 0,
        description: req.description,
        requestedAt: req.request_date,
        tripPrice: req.trip_price,
        totalPrice: req.total_price,
        proposedPrice: req.proposed_price,
        customerApproved: req.customerApproved,
      }));
      setRequests(transformedRequests);
    } catch (error) {
      console.error("Failed to refresh requests:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requests: filteredRequests,
    allRequests: requests,
    isLoading,
    filter,
    setFilter,
    counts,
    acceptRequest,
    declineRequest,
    updateRequestStatus,
    refreshRequests,
  };
};
