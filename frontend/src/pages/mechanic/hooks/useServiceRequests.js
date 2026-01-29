import { useState, useEffect } from "react";
import { serviceRequestAPI } from "@/lib/api";

/**
 * useServiceRequests Hook
 *
 * Manages service requests for mechanic dashboard
 */
export const useServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, pending, accepted, in-progress, completed

  useEffect(() => {
    const fetchRequests = async () => {
      setIsLoading(true);
      try {
        const response = await serviceRequestAPI.getIncomingRequests();
        setRequests(response.data || []);
      } catch (error) {
        console.error("Error fetching service requests:", error);
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
    return request.status === filter;
  });

  // Get counts by status
  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  const acceptRequest = async (requestId) => {
    try {
      const response = await serviceRequestAPI.acceptRequest(requestId);
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId
            ? { ...req, ...response.data.request, status: "accepted" }
            : req
        )
      );
      return { success: true, message: "Request accepted successfully" };
    } catch (error) {
      console.error("Error accepting request:", error);
      throw error;
    }
  };

  const declineRequest = async (requestId) => {
    try {
      const response = await serviceRequestAPI.rejectRequest(requestId);
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, ...response.data.request, status: "cancelled" } : req
        )
      );
      return { success: true, message: "Request declined" };
    } catch (error) {
      console.error("Error declining request:", error);
      throw error;
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      let response;
      if (newStatus === "completed") {
        response = await serviceRequestAPI.completeRequest(requestId);
      } else {
        // Handle other status updates if needed
        throw new Error(`Status update to ${newStatus} not implemented`);
      }

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, ...response.data.request, status: newStatus } : req
        )
      );

      return { success: true, message: `Request status updated to ${newStatus}` };
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  };

  const proposePrice = async (requestId, proposed_price) => {
    try {
      const response = await serviceRequestAPI.proposePrice(requestId, proposed_price);
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId ? { ...req, ...response.data.request, status: "proposed" } : req
        )
      );
      return { success: true, message: "Price proposed successfully" };
    } catch (error) {
      console.error("Error proposing price:", error);
      throw error;
    }
  };

  const refreshRequests = async () => {
    setIsLoading(true);
    try {
      const response = await serviceRequestAPI.getIncomingRequests();
      setRequests(response.data || []);
    } catch (error) {
      console.error("Error refreshing requests:", error);
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
    proposePrice,
    refreshRequests,
  };
};
