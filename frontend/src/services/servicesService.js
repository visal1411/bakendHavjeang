import apiClient from "./api";

/**
 * Services Service
 * Handles mechanic service management (CRUD operations)
 * Note: All endpoints require mechanic authentication
 */

const servicesService = {
  /**
   * Create a new service (Mechanic only)
   * @param {Object} serviceData
   * @param {string} serviceData.name - Service name
   * @param {number} serviceData.price - Service price
   * @param {string} serviceData.serviceType - 'moto' or 'car'
   * @returns {Promise} Created service data
   */
  createService: async (serviceData) => {
    const response = await apiClient.post("/services", serviceData);
    return response.data;
  },

  /**
   * Get all services for the authenticated mechanic
   * @returns {Promise} Array of mechanic's services
   */
  getMyServices: async () => {
    const response = await apiClient.get("/services/my");
    return response.data;
  },

  /**
   * Update a service (Mechanic only)
   * @param {number} serviceId - Service ID to update
   * @param {Object} updateData - Updated service data
   * @param {string} [updateData.name] - Service name
   * @param {number} [updateData.price] - Service price
   * @param {string} [updateData.serviceType] - 'moto' or 'car'
   * @returns {Promise} Updated service data
   */
  updateService: async (serviceId, updateData) => {
    const response = await apiClient.put(`/services/${serviceId}`, updateData);
    return response.data;
  },

  /**
   * Delete a service (Mechanic only)
   * @param {number} serviceId - Service ID to delete
   * @returns {Promise} Deletion confirmation
   */
  deleteService: async (serviceId) => {
    const response = await apiClient.delete(`/services/${serviceId}`);
    return response.data;
  },
};

export default servicesService;
