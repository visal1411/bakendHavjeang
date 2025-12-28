// src/service/pricingService.js
import { getDistanceKmORS } from "./distance/orsDistance.js";

const PRICE_PER_KM = Number(process.env.PRICE_PER_KM) || 1600;

export async function calculateTripAndTotalPrice(customerLocation, services) {
  if (!services.length) return { tripPrice: 0, totalPrice: 0 };

  let totalTripPrice = 0;

  for (const service of services) {
    const serviceLocation = {
      lng: service.location_lng,
      lat: service.location_lat
    };

    const distanceKm = await getDistanceKmORS(customerLocation, serviceLocation);
    totalTripPrice += distanceKm * PRICE_PER_KM;
  }

  const servicesTotal = services.reduce((sum, s) => sum + parseFloat(s.price), 0);
  const totalPrice = totalTripPrice + servicesTotal;

  return { tripPrice: totalTripPrice, totalPrice };
}
