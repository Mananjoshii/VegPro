import api from "./api";

/**
 * Authentication service for frontend.
 * Handles login flow and token management.
 */
const authService = {
  /**
   * Login with mobile number and optional password.
   * @param {string} mobile
   * @param {string|null} password
   * @returns {Object} API response data
   */
  async login(mobile, password = null) {
    const payload = { mobile };
    if (password) payload.password = password;

    const response = await api.post("/login", payload);
    const data = response.data.data;

    // If login is complete (token received), save to localStorage
    if (data.token) {
      localStorage.setItem("vegpro_token", data.token);
      localStorage.setItem("vegpro_user", JSON.stringify(data.user));
    }

    return data;
  },

  /**
   * Logout — clear stored credentials
   */
  logout() {
    localStorage.removeItem("vegpro_token");
    localStorage.removeItem("vegpro_user");
  },

  /**
   * Get the currently logged-in user from localStorage
   * @returns {Object|null}
   */
  getCurrentUser() {
    const user = localStorage.getItem("vegpro_user");
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if a user is currently logged in
   * @returns {boolean}
   */
  isLoggedIn() {
    return !!localStorage.getItem("vegpro_token");
  },
};

export default authService;
