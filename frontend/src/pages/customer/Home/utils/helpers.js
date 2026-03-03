/**
 * Calculate trip fee based on backend-provided amount with $2 minimum
 */
const MIN_TRIP_FEE = 2;

export const calculateTripFee = (mechanic) => {
  const fee = Number(mechanic?.trip_price ?? 0);
  if (Number.isNaN(fee)) {
    return MIN_TRIP_FEE;
  }
  return Math.max(fee, MIN_TRIP_FEE);
};

/**
 * Handle logout
 */
export const handleLogout = () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isAuthenticated");
  window.location.href = "/auth";
};
