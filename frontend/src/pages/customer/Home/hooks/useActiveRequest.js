import { useState, useEffect, useRef, useCallback } from "react";
import { serviceRequestsService } from "@/services";

const POLL_INTERVAL_MS = 10_000;
const ACTIVE_STATUSES = new Set(["pending", "accepted", "proposed"]);

const parseAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const mapRequest = (request) => {
  const tripFee = parseAmount(request.trip_price);
  const proposedPrice = parseAmount(request.proposed_price);
  const serviceItems = Array.isArray(request.service) ? request.service : [];
  const serviceFee = serviceItems.length
    ? serviceItems.reduce((sum, service) => sum + parseAmount(service.price), 0)
    : proposedPrice;
  const totalAmount = parseAmount(request.total_price) || tripFee + serviceFee;
  const normalizedStatus = (request.status || "").toLowerCase();

  return {
    id: request.id,
    serviceDate: request.request_date,
    mechanicName: request.mechanic?.name || "Pending Assignment",
    mechanicPhone: request.mechanic?.phone || "",
    serviceType: serviceItems.length
      ? serviceItems.map((service) => service.name).join(", ")
      : "Custom Service",
    status: normalizedStatus || "pending",
    location: request.address,
    tripFee,
    serviceFee,
    totalAmount,
    notes: request.description,
    proposedPrice,
    customerApproved: request.customerApproved,
    canRespondToPriceChange:
      proposedPrice > 0 &&
      normalizedStatus === "proposed" &&
      request.customerApproved !== true,
    canCancel: ACTIVE_STATUSES.has(normalizedStatus),
  };
};

export const useActiveRequest = () => {
  const [activeRequest, setActiveRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const intervalRef = useRef(null);

  const fetchActiveRequest = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsLoading(true);

    try {
      const response = await serviceRequestsService.getMyRequests();
      const requests = Array.isArray(response) ? response : [];
      const latestActiveRequest = requests
        .filter((request) =>
          ACTIVE_STATUSES.has((request.status || "").toLowerCase()),
        )
        .sort(
          (left, right) =>
            new Date(right.request_date).getTime() -
            new Date(left.request_date).getTime(),
        )[0];

      setActiveRequest(
        latestActiveRequest ? mapRequest(latestActiveRequest) : null,
      );
    } catch (error) {
      console.error("Failed to fetch active request:", error);
      if (showSpinner) {
        setActiveRequest(null);
      }
    } finally {
      if (showSpinner) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveRequest(true);

    intervalRef.current = setInterval(() => {
      fetchActiveRequest(false);
    }, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchActiveRequest]);

  const cancelRequest = async () => {
    if (!activeRequest?.id)
      return { success: false, message: "No active request" };

    try {
      await serviceRequestsService.cancelServiceRequest(activeRequest.id);
      setActiveRequest((current) =>
        current
          ? { ...current, status: "cancelled", canCancel: false }
          : current,
      );
      await fetchActiveRequest(false);
      return { success: true, message: "Request cancelled successfully" };
    } catch (error) {
      console.error("Failed to cancel request:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to cancel request",
      };
    }
  };

  const acceptPrice = async () => {
    if (!activeRequest?.id)
      return { success: false, message: "No active request" };

    try {
      await serviceRequestsService.acceptProposedPrice(activeRequest.id);
      setActiveRequest((current) =>
        current
          ? {
              ...current,
              customerApproved: true,
              status: "accepted",
              canRespondToPriceChange: false,
            }
          : current,
      );
      await fetchActiveRequest(false);
      return { success: true, message: "Price accepted successfully" };
    } catch (error) {
      console.error("Failed to accept price:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to accept price",
      };
    }
  };

  const declinePrice = async () => {
    if (!activeRequest?.id)
      return { success: false, message: "No active request" };

    try {
      await serviceRequestsService.declineProposedPrice(activeRequest.id);
      setActiveRequest(null);
      await fetchActiveRequest(false);
      return { success: true, message: "Price declined" };
    } catch (error) {
      console.error("Failed to decline price:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to decline price",
      };
    }
  };

  return {
    activeRequest,
    isLoading,
    refreshActiveRequest: fetchActiveRequest,
    cancelRequest,
    acceptPrice,
    declinePrice,
  };
};
