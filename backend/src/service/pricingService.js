import { getDistanceKmORS } from "./distance/orsDistance.js";

const PRICE_PER_KM_USD = Number(process.env.PRICE_PER_KM_USD ?? process.env.PRICE_PER_KM) || 0.4;
const MIN_TRIP_FEE_USD = Number(process.env.MIN_TRIP_FEE_USD) || 2;

/**
 * Calculate trip price from customer to mechanic.
 */
export async function calculateTripPrice(customerLocation, mechanicLocation) {
  if (!mechanicLocation.lat || !mechanicLocation.lng) return { tripDistanceKm: 0, tripPrice: 0 };

  const tripDistanceKm = await getDistanceKmORS(customerLocation, mechanicLocation);
  const rawPrice = Number((tripDistanceKm * PRICE_PER_KM_USD).toFixed(2));
  const tripPrice = Math.max(MIN_TRIP_FEE_USD, rawPrice);

  return { tripDistanceKm: Number(tripDistanceKm.toFixed(2)), tripPrice };
}

/**
 * Calculate total price for known services.
 */
export function calculateTotalPrice(tripPrice, services = []) {
  const servicesTotal = services.reduce((sum, s) => sum + Number(s.price), 0);
  return tripPrice + servicesTotal;
}

/**
 * Calculate total price for unknown service (after mechanic proposes).
 */
export function calculateUnknownTotal(tripPrice, proposedPrice) {
  return tripPrice + (proposedPrice || 0);
}