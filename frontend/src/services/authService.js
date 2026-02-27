import apiClient from "./api";

/**
 * Authentication Service
 * Handles user registration, login, session management, and profile
 */

const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User's full name
   * @param {string} userData.phone - Phone number (unique)
   * @param {string} userData.password - User's password
   * @param {string} userData.usertype - 'customer' or 'mechanic'
   * @param {string} [userData.working_hours] - Working hours (for mechanics)
   * @param {number} [userData.mechanic_lat] - Latitude (for mechanics)
   * @param {number} [userData.mechanic_lng] - Longitude (for mechanics)
   * @returns {Promise} Registration response
   */
  register: async (userData) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials
   * @param {string} credentials.phone - User's phone number
   * @param {string} credentials.password - User's password
   * @returns {Promise} Login response with token and user data
   */
  login: async (credentials) => {
    const response = await apiClient.post("/auth/login", credentials);
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem("hav_jeang_token", response.data.token);
    }
    return response.data;
  },

  /**
   * Check current session
   * @returns {Promise} User session data
   */
  checkSession: async () => {
    const response = await apiClient.get("/auth/check-session");
    return response.data;
  },

  /**
   * Get user profile by ID
   * GET /api/auth/users/:id/profile
   * 
   * Returns for Customer: { name, phone, usertype }
   * Returns for Mechanic: { name, phone, location: { lng, lat }, working_hours, usertype }
   * 
   * @param {number} userId - User ID
   * @returns {Promise} User profile data
   */
  getProfileById: async (userId) => {
    const response = await apiClient.get(`/auth/users/${userId}/profile`);
    return response.data;
  },

  /**
   * Update user profile by ID
   * @param {number} userId - User ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Updated user profile data
   */
  updateProfileById: async (userId, profileData) => {
    const response = await apiClient.put(`/auth/users/${userId}/profile`, profileData);
    return response.data;
  },

  /**
   * Logout user (client-side)
   * Clears all stored authentication data
   */
  logout: () => {
    localStorage.removeItem("hav_jeang_token");
    localStorage.removeItem("hav_jeang_auth");
    localStorage.removeItem("hav_jeang_user");
  },
};

export default authService;
