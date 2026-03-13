import apiClient from "./api";

/**
 * Push Notification Service
 * Handles web push notification subscriptions
 */

const pushService = {
  /**
   * Fetch VAPID public key from backend
   * @returns {Promise<{publicKey: string | null}>}
   */
  getPublicKey: async () => {
    const response = await apiClient.get("/push/public-key");
    return response.data;
  },

  /**
   * Subscribe to push notifications
   * @param {Object} subscription - Push subscription object from browser
   * @param {string} subscription.endpoint - Push endpoint URL
   * @param {string} subscription.p256dh - Public key
   * @param {string} subscription.auth - Auth secret
   * @returns {Promise} Subscription confirmation
   */
  subscribe: async (subscription) => {
    const normalized =
      typeof subscription?.toJSON === "function"
        ? subscription.toJSON()
        : subscription;

    const response = await apiClient.post("/push/subscribe", normalized);
    return response.data;
  },

  /**
   * Unsubscribe from push notifications
   * @param {Object} subscription - Push subscription object
   * @param {string} subscription.endpoint - Push endpoint URL to remove
   * @returns {Promise} Unsubscribe confirmation
   */
  unsubscribe: async (subscription) => {
    const normalized =
      typeof subscription?.toJSON === "function"
        ? subscription.toJSON()
        : subscription;

    const response = await apiClient.post("/push/unsubscribe", {
      endpoint: normalized?.endpoint,
    });
    return response.data;
  },
};

export default pushService;
