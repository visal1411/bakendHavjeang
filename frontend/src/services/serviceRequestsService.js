import apiClient from "./api";

/**
 * Service Requests Service
 * Handles customer and mechanic service request operations
 */

const serviceRequestsService = {
  // =====================
  // CUSTOMER ENDPOINTS
  // =====================

  /**
   * Create a new service request (Customer only)
   * @param {Object} requestData
   * @param {string} requestData.address - Service location address
   * @param {number} requestData.request_lat - Latitude
   * @param {number} requestData.request_lng - Longitude
   * @param {number} requestData.trip_price - Trip/distance price
   * @param {string} [requestData.description] - Optional description
   * @param {Array<number>} [requestData.serviceIds] - Array of service IDs (for known services)
   * @returns {Promise} Created service request
   */
  createServiceRequest: async (requestData) => {
    const response = await apiClient.post(
      "/servicerequests/customer",
      requestData,
    );
    return response.data;
  },

  /**
   * Get all requests for the authenticated customer
   * @returns {Promise} Array of customer's service requests
   */
  getMyRequests: async () => {
    const response = await apiClient.get("/servicerequests/customer/my");
    return response.data;
  },

  /**
   * Get grand total for a request (trip + services)
   * @param {number} requestId - Service request ID
   * @returns {Promise} Total price calculation
   */
  getRequestTotal: async (requestId) => {
    const response = await apiClient.get(
      `/servicerequests/customer/${requestId}/total`,
    );
    return response.data;
  },

  /**
   * Cancel a service request (Customer only)
   * @param {number} requestId - Service request ID to cancel
   * @returns {Promise} Updated request with cancelled status
   */
  cancelServiceRequest: async (requestId) => {
    const response = await apiClient.patch(
      `/servicerequests/customer/${requestId}/cancel`,
    );
    return response.data;
  },

  /**
   * Get nearby mechanics based on customer location
   * @param {Object} params
   * @param {number} params.lat - Customer latitude
   * @param {number} params.lng - Customer longitude
   * @param {number} [params.maxDistance] - Maximum distance in km (optional)
   * @returns {Promise} Array of nearby mechanics with distance
   */
  getNearbyMechanics: async (params) => {
    const response = await apiClient.get("/servicerequests/customer/nearby", {
      params,
    });
    return response.data;
  },

  /**
   * Get mechanic info by ID
   * @param {number} mechanicId - Mechanic user ID
   * @returns {Promise} Mechanic information
   */
  getMechanicById: async (mechanicId) => {
    const response = await apiClient.get(
      `/servicerequests/customer/${mechanicId}/info`,
    );
    return response.data;
  },

  /**
   * Get all services provided by a specific mechanic
   * @param {number} mechanicId - Mechanic user ID
   * @returns {Promise} Array of mechanic's services
   */
  getServicesByMechanic: async (mechanicId) => {
    const response = await apiClient.get(
      `/servicerequests/customer/${mechanicId}/services`,
    );
    return response.data;
  },

  /**
   * Accept proposed price from mechanic (Customer only)
   * @param {number} requestId - Service request ID
   * @returns {Promise} Updated request with accepted status
   */
  acceptProposedPrice: async (requestId) => {
    const response = await apiClient.patch(
      `/servicerequests/customer/${requestId}/accept-price`,
    );
    return response.data;
  },

  /**
   * Decline proposed price from mechanic (Customer only)
   * @param {number} requestId - Service request ID
   * @returns {Promise} Updated request
   */
  declineProposedPrice: async (requestId) => {
    const response = await apiClient.patch(
      `/servicerequests/customer/${requestId}/decline-price`,
    );
    return response.data;
  },

  // =====================
  // MECHANIC ENDPOINTS
  // =====================

  /**
   * Get incoming service requests for mechanic (pending only)
   * @returns {Promise} Array of incoming requests
   */
  getIncomingRequests: async () => {
    const response = await apiClient.get("/servicerequests/mechanic/incoming");
    return response.data;
  },

  /**
   * Get all active service requests for mechanic (pending, accepted, in-progress)
   * @returns {Promise} Array of active requests
   */
  getActiveRequests: async () => {
    const response = await apiClient.get("/servicerequests/mechanic/active");
    return response.data;
  },

  /**
   * Get completed/cancelled service history for mechanic
   * @returns {Promise} Array of historical requests
   */
  getMechanicHistory: async () => {
    const response = await apiClient.get("/servicerequests/mechanic/history");
    return response.data;
  },

  /**
   * Accept a service request (Mechanic only)
   * @param {number} requestId - Service request ID to accept
   * @returns {Promise} Updated request with accepted status
   */
  acceptServiceRequest: async (requestId) => {
    const response = await apiClient.patch(
      `/servicerequests/mechanic/${requestId}/accept`,
    );
    return response.data;
  },

  /**
   * Reject a service request (Mechanic only)
   * @param {number} requestId - Service request ID to reject
   * @returns {Promise} Rejection confirmation
   */
  rejectServiceRequest: async (requestId) => {
    const response = await apiClient.patch(
      `/servicerequests/mechanic/${requestId}/reject`,
    );
    return response.data;
  },

  /**
   * Mark a service request as complete (Mechanic only)
   * @param {number} requestId - Service request ID to complete
   * @returns {Promise} Updated request with completed status
   */
  completeServiceRequest: async (requestId) => {
    const response = await apiClient.patch(
      `/servicerequests/mechanic/${requestId}/complete`,
    );
    return response.data;
  },

  /**
   * Propose a price for unknown service (Mechanic only)
   * @param {number} requestId - Service request ID
   * @param {Object} priceData
   * @param {number} priceData.proposed_price - Proposed price amount
   * @returns {Promise} Updated request with proposed price
   */
  proposeServicePrice: async (requestId, priceData) => {
    const response = await apiClient.patch(
      `/servicerequests/mechanic/${requestId}/propose-price`,
      priceData,
    );
    return response.data;
  },
};

export default serviceRequestsService;
