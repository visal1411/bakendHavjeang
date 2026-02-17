import { useState } from "react";
import { calculateTripFee } from "../utils/helpers";

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

  const openServiceRequest = (mechanic) => {
    setSelectedMechanic(mechanic);
    setShowServiceRequest(true);
    setCalculatedTripFee(calculateTripFee(mechanic));
  };

  const closeServiceRequest = () => {
    setShowServiceRequest(false);
    setSelectedServices([]);
    setServiceDescription("");
    setPhotos([]);
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
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const submitServiceRequest = () => {
    if (selectedServices.length === 0 && !serviceDescription.trim()) {
      alert("Please select a service or describe your issue");
      return;
    }

    // In production: Send to API with photos
    console.log("Service Request:", {
      mechanic: selectedMechanic,
      services: selectedServices,
      description: serviceDescription,
      tripFee: calculatedTripFee,
      customerLocation: userLocation,
      photos: photos.map((p) => p.file),
    });

    alert(
      `Request sent to ${selectedMechanic.name}!\n\n` +
        `Trip Fee: $${calculatedTripFee}\n` +
        `Photos: ${photos.length}\n\n` +
        `You'll be notified when the mechanic responds.`
    );

    closeServiceRequest();
  };

  return {
    selectedMechanic,
    showServiceRequest,
    serviceDescription,
    selectedServices,
    calculatedTripFee,
    photos,
    openServiceRequest,
    closeServiceRequest,
    setServiceDescription,
    toggleServiceType,
    addPhoto,
    removePhoto,
    submitServiceRequest,
  };
};
