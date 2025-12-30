import { getDistanceKmORS } from "./distance/orsDistance.js"

const PRICE_PER_KM = Number(process.env.PRICE_PER_KM) || 1600

export async function calculateTripAndTotalPrice(customerLocation, services) {
  if (!services.length) {
    return { tripDistanceKm: 0, tripPrice: 0, totalPrice: 0 }
  }

  let totalTripDistance = 0
  let totalTripPrice = 0

  for (const service of services) {
    const mechanicLocation = {
      lat: service.mechanic.mechanic_lat,
      lng: service.mechanic.mechanic_lng
    }

    const distanceKm = await getDistanceKmORS(customerLocation, mechanicLocation)

    totalTripDistance += distanceKm
    totalTripPrice += distanceKm * PRICE_PER_KM
  }

  const servicesTotal = services.reduce(
    (sum, s) => sum + Number(s.price),
    0
  )

  return {
    tripDistanceKm: Number(totalTripDistance.toFixed(2)),
    tripPrice: Math.round(totalTripPrice),
    totalPrice: Math.round(totalTripPrice + servicesTotal)
  }
}
