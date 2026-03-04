import axios from "axios";

export async function getDistanceKmORS(origin, destination) {
  const apiKey = process.env.ORS_API_KEY;

  if (!apiKey) {
    console.error("ORS_API_KEY environment variable is not set");
    throw new Error("ORS API key not configured");
  }

  const url = "https://api.openrouteservice.org/v2/directions/driving-car";

  try {
    const response = await axios.post(
      url,
      {
        coordinates: [
          [origin.lng, origin.lat],
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

    // ORS returns "routes[0].summary.distance"
    const route = response.data?.routes?.[0];
    if (!route || !route.summary) {
      console.error("ORS raw response:", JSON.stringify(response.data, null, 2));
      throw new Error("No route returned from ORS");
    }

    return route.summary.distance / 1000; // meters → km

  } catch (error) {
    console.error("ORS distance error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`Cannot calculate distance via ORS: ${error.message}`);
  }
}
