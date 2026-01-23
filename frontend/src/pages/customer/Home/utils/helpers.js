/**
 * Calculate trip fee based on distance and base rate
 */
export const calculateTripFee = (mechanic) => {
  const fee = mechanic.distance * mechanic.baseTripFee;
  return fee.toFixed(2);
};

/**
 * Handle logout
 */
export const handleLogout = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAuthenticated");
  window.location.href = "/auth";
};
