import { useState, useEffect, useRef, useCallback } from "react";
import { serviceRequestsService } from "@/services";

const POLL_INTERVAL_MS = 10_000;

/**
 * useServiceRequests Hook
 *
 * Manages service requests for mechanic dashboard
 */
export const useServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // pending, proposed, accepted, completed, cancelled
  const intervalRef = useRef(null);

  const mapIncomingRequest = (req) => {
    const requestLat = Number(req.request_lat ?? req.req_lat);
    const requestLng = Number(req.request_lng ?? req.req_lng);
    const parsedBackendDistance = Number(req.distance);
    const backendDistance = Number.isFinite(parsedBackendDistance)
      ? parsedBackendDistance
      : null;
    const hasCoordinates =
      Number.isFinite(requestLat) && Number.isFinite(requestLng);
    const coordinateLabel = hasCoordinates
      ? `${requestLat.toFixed(6)}, ${requestLng.toFixed(6)}`
      : "Unknown";
    const normalizedAddress =
      typeof req.address === "string" ? req.address.trim() : "";
    const hasValidAddress =
      Boolean(normalizedAddress) &&
      normalizedAddress.toLowerCase() !== "unknown";
    const serviceItems = Array.isArray(req.service) ? req.service : [];
    const isKnownService = serviceItems.length > 0;
    const serviceFee = serviceItems.reduce(
      (sum, serviceItem) => sum + Number(serviceItem?.price ?? 0),
      0,
    );
    const tripPrice = Number(req.trip_price) || 0;
    const parsedTotalPrice = Number(req.total_price);
    const totalPrice = Number.isFinite(parsedTotalPrice)
      ? parsedTotalPrice
      : tripPrice + serviceFee;

    return {
      id: req.id,
      customerName: req.customer?.name || "Unknown Customer",
      customerPhone: req.customer?.phone,
      location: {
        address: hasValidAddress ? normalizedAddress : coordinateLabel,
        lat: hasCoordinates ? requestLat : null,
        lng: hasCoordinates ? requestLng : null,
      },
      distance: backendDistance,
      serviceType:
        req.service?.map((serviceItem) => serviceItem.name).join(", ") ||
        "Unknown Service",
      serviceCategory: req.service?.[0]?.serviceType
        ? req.service[0].serviceType.charAt(0).toUpperCase() +
          req.service[0].serviceType.slice(1)
        : "Unknown",
      isKnownService,
      serviceFee,
      status: req.status,
      tripPrice,
      estimatedTripFee: tripPrice,
      totalPrice,
      proposedPrice: req.proposed_price,
      description: req.description,
      request_lat: hasCoordinates ? requestLat : null,
      request_lng: hasCoordinates ? requestLng : null,
      requestedAt: req.request_date,
      createdAt: req.request_date,
      customerApproved: req.customerApproved,
    };
  };

  const fetchRequests = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);
    try {
      const response = await serviceRequestsService.getActiveRequests();
      const transformedRequests = response.map(mapIncomingRequest);
      setRequests(transformedRequests);
    } catch (error) {
      console.error("Failed to fetch service requests:", error);
      if (showSpinner) setRequests([]);
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Initial fetch with loading spinner
    fetchRequests(true);

    // Start background polling
    intervalRef.current = setInterval(() => {
      fetchRequests(false);
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchRequests]);

  // Filter requests based on status
  const filteredRequests = requests.filter((request) => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  // Get counts by status
  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    proposed: requests.filter((r) => r.status === "proposed").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
    completed: requests.filter((r) => r.status === "completed").length,
    cancelled: requests.filter((r) => r.status === "cancelled").length,
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

  const proposePrice = async (requestId, price) => {
    try {
      const response = await serviceRequestsService.proposeServicePrice(
        requestId,
        { proposed_price: price },
      );

      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === requestId
            ? { ...req, status: "proposed", proposedPrice: price }
            : req,
        ),
      );

      return { success: true, message: "Price proposed successfully" };
    } catch (error) {
      console.error("Failed to propose price:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to propose price",
      };
    }
  };

  const refreshRequests = async () => {
    await fetchRequests(true);
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
