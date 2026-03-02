/**
 * Calculate trip fee based on distance and base rate
 * Uses the trip_price already calculated by the backend
 */
export const calculateTripFee = (mechanic) => {
  // Use the backend-calculated trip_price directly (already in base units)
  return mechanic.trip_price || 0;
};

/**
 * Handle logout
 */
export const handleLogout = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAuthenticated");
  window.location.href = "/auth";
};
