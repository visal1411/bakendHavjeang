import apiClient from "./api";

/**
 * Push Notification Service
 * Handles web push notification subscriptions
 */

const pushService = {
  /**
   * Subscribe to push notifications
   * @param {Object} subscription - Push subscription object from browser
   * @param {string} subscription.endpoint - Push endpoint URL
   * @param {string} subscription.p256dh - Public key
   * @param {string} subscription.auth - Auth secret
   * @returns {Promise} Subscription confirmation
   */
  subscribe: async (subscription) => {
    const response = await apiClient.post("/push/subscribe", subscription);
    return response.data;
  },

  /**
   * Unsubscribe from push notifications
   * @param {Object} subscription - Push subscription object
   * @param {string} subscription.endpoint - Push endpoint URL to remove
   * @returns {Promise} Unsubscribe confirmation
   */
  unsubscribe: async (subscription) => {
    const response = await apiClient.post("/push/unsubscribe", subscription);
    return response.data;
  },
};

export default pushService;
