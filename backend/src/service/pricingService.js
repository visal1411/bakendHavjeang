import { getDistanceKmORS } from "./distance/orsDistance.js";

const PRICE_PER_KM = Number(process.env.PRICE_PER_KM) || 1600;

/**
 * Calculate trip price from customer to mechanic.
 */
export async function calculateTripPrice(customerLocation, mechanicLocation) {
  if (!mechanicLocation.lat || !mechanicLocation.lng) return { tripDistanceKm: 0, tripPrice: 0 };

  const tripDistanceKm = await getDistanceKmORS(customerLocation, mechanicLocation);
  const tripPrice = Math.round(tripDistanceKm * PRICE_PER_KM);

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