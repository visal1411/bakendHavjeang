// src/service/pricingService.js
import { getDistanceKmORS } from "./distance/orsDistance.js";

const PRICE_PER_KM = Number(process.env.PRICE_PER_KM) || 1600;

export async function calculateTripAndTotalPrice(customerLocation, services) {
  if (!services.length) return { tripDistanceKm: 0, tripPrice: 0, totalPrice: 0 };

  let totalTripPrice = 0;
  let totalTripDistance = 0; // <-- track total distance in km

  for (const service of services) {
    const serviceLocation = {
      lng: service.location_lng,
      lat: service.location_lat
    };

    const distanceKm = await getDistanceKmORS(customerLocation, serviceLocation);
    totalTripDistance += distanceKm;          // sum up distances
    totalTripPrice += distanceKm * PRICE_PER_KM;
  }

  const servicesTotal = services.reduce((sum, s) => sum + parseFloat(s.price), 0);
  const totalPrice = totalTripPrice + servicesTotal;

 return {
    tripDistanceKm: Number(totalTripDistance.toFixed(2)), // round to 2 decimals
    tripPrice: Math.round(totalTripPrice),               // round to int
    totalPrice: Math.round(totalPrice)                  // round to int
  };
}
