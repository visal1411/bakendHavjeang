import { useState, useEffect } from "react";
import { serviceRequests as mockRequests } from "@/data/mockData";

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
    // Simulate fetching service requests from API
    const fetchRequests = async () => {
      setIsLoading(true);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setRequests(mockRequests);
      setIsLoading(false);
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId
          ? { ...req, status: "accepted", acceptedAt: new Date().toISOString() }
          : req
      )
    );

    return { success: true, message: "Request accepted successfully" };
  };

  const declineRequest = async (requestId) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { ...req, status: "declined" } : req
      )
    );

    return { success: true, message: "Request declined" };
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );

    return { success: true, message: `Request status updated to ${newStatus}` };
  };

  const refreshRequests = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRequests(mockRequests);
    setIsLoading(false);
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
