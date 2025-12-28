// src/service/distance/orsDistance.js
import axios from "axios";

export async function getDistanceKmORS(origin, destination) {
  const apiKey = process.env.ORS_API_KEY;
  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  try {
    const response = await axios.post(
      url,
      {
        coordinates: [
          [origin.lng, origin.lat],       // ORS expects [lng, lat]
          [destination.lng, destination.lat]
        ],
        instructions: false,
        geometry: false
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json"
        }
      }
    );

    const feature = response.data?.features?.[0];
    const segment = feature?.properties?.segments?.[0];

    if (!segment) {
      console.error("ORS raw response:", JSON.stringify(response.data, null, 2));
      throw new Error("No route returned from ORS");
    }

    return segment.distance / 1000; // meters → km
  } catch (error) {
    console.error("ORS distance error:", error.response?.data || error.message);
    throw new Error("Cannot calculate distance via ORS");
  }
}
