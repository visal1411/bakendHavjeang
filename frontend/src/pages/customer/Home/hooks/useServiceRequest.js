import { useState, useCallback } from "react";
import { calculateTripFee } from "../utils/helpers";
import { serviceRequestsService } from "@/services";

/**
 * 🛠️ useServiceRequest Hook
 *
 * Manages the entire service request workflow from mechanic selection to submission.
 * Handles service type selection, description input, and trip fee calculation.
 *
 * @param {Array<number>} userLocation - User's [latitude, longitude]
 *
 * @returns {Object} Service request state and handlers
 * @property {Object|null} selectedMechanic - Currently selected mechanic
 * @property {boolean} showServiceRequest - Modal visibility state
 * @property {string} serviceDescription - User's issue description
 * @property {Array<string>} selectedServices - Array of selected service IDs
 * @property {number} calculatedTripFee - Trip fee in USD based on distance
 * @property {Function} openServiceRequest - Opens modal with selected mechanic
 * @property {Function} closeServiceRequest - Closes modal and resets state
 * @property {Function} toggleServiceType - Toggles service selection
 * @property {Function} submitServiceRequest - Submits the request (validates first)
 *
 * @example
 * const { openServiceRequest, submitServiceRequest } = useServiceRequest(userLocation);
 * <button onClick={() => openServiceRequest(mechanic)}>Request Service</button>
 */
export const useServiceRequest = (userLocation) => {
  const [selectedMechanic, setSelectedMechanic] = useState(null);
  const [showServiceRequest, setShowServiceRequest] = useState(false);
  const [serviceDescription, setServiceDescription] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [calculatedTripFee, setCalculatedTripFee] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [isServicesLoading, setIsServicesLoading] = useState(false);
  const [serviceLoadError, setServiceLoadError] = useState("");

  const loadMechanicServices = useCallback(async (mechanicId) => {
    if (!mechanicId) {
      setServiceOptions([]);
      return;
    }

    try {
      setIsServicesLoading(true);
      setServiceLoadError("");
      const response = await serviceRequestsService.getServicesByMechanic(mechanicId);
      const normalized = Array.isArray(response)
        ? response.map((service) => ({
            id: service.id,
            name: service.name || service.serviceType || "Custom service",
            price: Number(service.price ?? 0),
            serviceType: service.serviceType || "other",
          }))
        : [];
      setServiceOptions(normalized);
    } catch (error) {
      console.error("Failed to load mechanic services:", error);
      setServiceLoadError(
        error?.response?.data?.message || "Failed to load mechanic services."
      );
      setServiceOptions([]);
    } finally {
      setIsServicesLoading(false);
    }
  }, []);

  const openServiceRequest = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowServiceRequest(true);
    setCalculatedTripFee(calculateTripFee(mechanic));
    setSelectedServices([]);
    setServiceDescription("");
    setPhotos([]);
    setServiceOptions([]);
    setServiceLoadError("");

    if (mechanic?.id) {
      loadMechanicServices(mechanic.id);
    }
  };

  const closeServiceRequest = () => {
    setShowServiceRequest(false);
    setSelectedMechanic(null);
    setSelectedServices([]);
    setServiceDescription("");
    setPhotos([]);
    setServiceOptions([]);
    setServiceLoadError("");
  };

  const addPhoto = (file) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Photo size must be less than 5MB");
      return;
    }

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotos((prev) => [
        ...prev,
        {
          file,
          preview: reader.result,
          id: Date.now() + Math.random(),
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (photoId) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  const toggleServiceType = (serviceId) => {
    if (serviceId === undefined || serviceId === null) return;

    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId],
    );
  };

  const submitServiceRequest = async () => {
    if (selectedServices.length === 0 && !serviceDescription.trim()) {
      alert("Please select a service or describe your issue");
      return;
    }

    try {
      // Prepare request data
      const numericServiceIds = selectedServices
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id));

      const requestData = {
        address: selectedMechanic.location || "Current Location",
        request_lat: userLocation[0],
        request_lng: userLocation[1],
        trip_price: calculatedTripFee,
        description: serviceDescription || null,
        serviceIds: numericServiceIds.length > 0 ? numericServiceIds : undefined,
      };

      // Submit to backend
      const response =
        await serviceRequestsService.createServiceRequest(requestData);

      console.log("Service request created:", response);

      alert(
        `Request sent successfully!\n\n` +
          `Trip Fee: $${calculatedTripFee}\n` +
          `Photos: ${photos.length}\n\n` +
          `You'll be notified when a mechanic responds.`,
      );

      closeServiceRequest();
      return response;
    } catch (error) {
      console.error("Failed to submit service request:", error);
      alert(
        `Failed to submit request: ${error.response?.data?.message || error.message}`,
      );
    }
  };

  return {
    selectedMechanic,
    showServiceRequest,
    serviceDescription,
    selectedServices,
    calculatedTripFee,
    photos,
    serviceOptions,
    isServicesLoading,
    serviceLoadError,
    openServiceRequest,
    closeServiceRequest,
    setServiceDescription,
    toggleServiceType,
    addPhoto,
    removePhoto,
    submitServiceRequest,
    retryServiceOptions: () => {
      if (selectedMechanic?.id) {
        loadMechanicServices(selectedMechanic.id);
      }
    },
  };
};
