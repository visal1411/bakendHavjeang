// src/controller/serviceRequest.js
import { prisma } from "../config/db.js";
import {
  calculateTripPrice,
  calculateTotalPrice,
  calculateUnknownTotal,
} from "../service/pricingService.js";
import {
  notifyMechanic,
  notifyCustomer,
  isUserOnline,
} from "../service/socketService.js";
import { sendPushToUser } from "../service/pushService.js";
import { getDistanceKmORS } from "../service/distance/orsDistance.js";

const getMechanicLocation = async (mechanicId) => {
  const mechanic = await prisma.user.findUnique({
    where: { id: mechanicId },
    select: {
      mechanic_lat: true,
      mechanic_lng: true,
    },
  });

  const lat = Number(mechanic?.mechanic_lat);
  const lng = Number(mechanic?.mechanic_lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
};

const enrichRequestsWithDistance = async (requests, mechanicId) => {
  const mechanicLocation = await getMechanicLocation(mechanicId);

  if (!mechanicLocation) {
    return requests.map((request) => ({ ...request, distance: null }));
  }

  return Promise.all(
    requests.map(async (request) => {
      const requestLat = Number(request.request_lat);
      const requestLng = Number(request.request_lng);

      if (!Number.isFinite(requestLat) || !Number.isFinite(requestLng)) {
        return { ...request, distance: null };
      }

      const customerLocation = { lat: requestLat, lng: requestLng };

      try {
        const distanceKm = await getDistanceKmORS(
          customerLocation,
          mechanicLocation,
        );
        return {
          ...request,
          distance: Number(distanceKm.toFixed(2)),
        };
      } catch (error) {
        console.error(
          `Distance calculation failed for request ${request.id}:`,
          error.message,
        );
        return { ...request, distance: null };
      }
    }),
  );
};

// ============================
// CUSTOMER: Create service request
// ============================
export const createServiceRequest = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      serviceIds,
      mechanicId,
      description,
      address,
      request_lat,
      request_lng,
    } = req.body;

    if (!address || request_lat == null || request_lng == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const customerLocation = { lat: request_lat, lng: request_lng };
    let mechanic = null;
    let services = [];

    // KNOWN SERVICE FLOW
    if (Array.isArray(serviceIds) && serviceIds.length) {
      services = await prisma.service.findMany({
        where: { id: { in: serviceIds } },
        include: { mechanic: true },
      });

      if (!services.length)
        return res.status(400).json({ message: "Services not found" });
    }

    // UNKNOWN SERVICE FLOW
    if (mechanicId) {
      mechanic = await prisma.user.findUnique({ where: { id: mechanicId } });
      if (!mechanic || mechanic.usertype !== "mechanic")
        return res.status(404).json({ message: "Mechanic not found" });
    }

    // If no mechanic selected yet, pick first mechanic from known services
    if (!mechanic && services.length > 0) {
      mechanic = services[0].mechanic;
    }

    if (!mechanic)
      return res.status(400).json({ message: "Mechanic is required" });

    // PRICE CALCULATION
    let tripDistanceKm = 0;
    let tripPrice = 0;

    try {
      const priceResult = await calculateTripPrice(customerLocation, {
        lat: mechanic.mechanic_lat,
        lng: mechanic.mechanic_lng,
      });
      tripDistanceKm = priceResult.tripDistanceKm;
      tripPrice = priceResult.tripPrice;
    } catch (error) {
      console.error("Price calculation failed:", error.message);
      return res.status(500).json({
        message: "Could not calculate trip price. Please try again.",
        error: error.message,
      });
    }

    let totalPrice = services.length
      ? calculateTotalPrice(tripPrice, services)
      : tripPrice; // Even for unknown services, include trip price

    console.log("DEBUG PRICES:", {
      mechanicLat: mechanic.mechanic_lat,
      mechanicLng: mechanic.mechanic_lng,
      tripDistanceKm,
      tripPrice,
      isTripPriceNaN: Number.isNaN(tripPrice),
    });

    const request = await prisma.serviceRequest.create({
      data: {
        customer: { connect: { id: customerId } },
        mechanic: { connect: { id: mechanic.id } },
        description,
        address,
        request_lat,
        request_lng,
        trip_price: tripPrice,
        total_price: totalPrice,
        status: "pending",
        service: services.length
          ? { connect: serviceIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        service: true,
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    const notificationPayload = {
      message: "You have a new service request",
      request: {
        id: request.id,
        customer: request.customer,
        description: request.description,
        address: request.address,
        request_lat: request.request_lat,
        request_lng: request.request_lng,
        trip_price: request.trip_price,
        total_price: request.total_price,
        status: request.status,
        service: request.service,
        request_date: request.request_date,
      },
    };

    // Notify mechanic: WebSocket if online, otherwise Web Push
    if (isUserOnline(mechanic.id)) {
      notifyMechanic(mechanic.id, "new_service_request", notificationPayload);
    } else {
      await sendPushToUser(mechanic.id, {
        type: "new_service_request",
        title: "New service request",
        body: `You have a new service request from ${request.customer.name}`,
        data: {
          requestId: request.id,
          customerId: request.customer.id,
        },
      });
    }

    res.status(201).json({ request, tripDistanceKm });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// CUSTOMER: Accept proposed price
// ============================
export const acceptProposedPrice = async (req, res) => {
  try {
    const customerId = req.user.id;
    const requestId = Number(req.params.id);

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.customerId !== customerId)
      return res.status(403).json({ message: "Not allowed" });
    if (!request.proposed_price)
      return res.status(400).json({ message: "No price proposed yet" });

    const totalPrice = calculateUnknownTotal(
      request.trip_price,
      request.proposed_price,
    );

    const updated = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        customerApproved: true,
        total_price: totalPrice,
        status: "accepted",
      },
    });

    // Notify mechanic: WebSocket if online, otherwise Web Push
    if (request.mechanicId) {
      if (isUserOnline(request.mechanicId)) {
        notifyMechanic(request.mechanicId, "price_accepted", {
          message: "Customer accepted your proposed price",
          request: {
            id: updated.id,
            status: updated.status,
            total_price: updated.total_price,
          },
        });
      } else {
        await sendPushToUser(request.mechanicId, {
          type: "price_accepted",
          title: "Price accepted",
          body: "The customer accepted your proposed price.",
          data: {
            requestId: updated.id,
            customerId,
          },
        });
      }
    }

    res.json({ message: "Price accepted", request: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// CUSTOMER: Decline proposed price
// ============================
export const declineProposedPrice = async (req, res) => {
  try {
    const customerId = req.user.id;
    const requestId = Number(req.params.id);
    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });
    if (!request || request.customerId !== customerId)
      return res.status(403).json({ message: "Not allowed" });

    const updated = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { customerApproved: false, status: "cancelled" },
    });

    // Notify mechanic: WebSocket if online, otherwise Web Push
    if (request.mechanicId) {
      if (isUserOnline(request.mechanicId)) {
        notifyMechanic(request.mechanicId, "price_declined", {
          message: "Customer declined your proposed price",
          request: {
            id: updated.id,
            status: updated.status,
          },
        });
      } else {
        await sendPushToUser(request.mechanicId, {
          type: "price_declined",
          title: "Price declined",
          body: "The customer declined your proposed price.",
          data: {
            requestId: updated.id,
            customerId,
          },
        });
      }
    }

    res.json({ message: "Price declined", request: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// // ============================p
// // CUSTOMER: Get mechanic info
// // ============================
// export const getCustomerById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const customer = await prisma.user.findUnique({
//       where: { id: Number(id) },
//       select: {
//         id: true,
//         name: true,
//         phone: true,
//         usertype: true,
//       }
//     });

//     if (!customer || customer.usertype !== "customer") {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     res.status(200).json({ message: "Customer fetched successfully", customer });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// ============================
// CUSTOMER: Get mechanic info
// ============================
export const getMechanicById = async (req, res) => {
  try {
    const { id } = req.params;
    const mechanic = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        phone: true,
        usertype: true,
        mechanic_lat: true,
        mechanic_lng: true,
        working_hours: true,
      },
    });

    if (!mechanic || mechanic.usertype !== "mechanic") {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    res
      .status(200)
      .json({ message: "Mechanic fetched successfully", mechanic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// CUSTOMER: Get all services by a mechanic
// ============================
export const getServicesByMechanic = async (req, res) => {
  try {
    const mechanicId = Number(req.params.mechanicId);
    const services = await prisma.service.findMany({ where: { mechanicId } });
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// CUSTOMER: Get grand total for a request (trip + services)
// ============================
export const getRequestTotal = async (req, res) => {
  try {
    const customerId = req.user.id;
    const requestId = Number(req.params.id);

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { service: true },
    });

    if (!request)
      return res.status(404).json({ message: "Service request not found" });
    if (request.customerId !== customerId)
      return res.status(403).json({ message: "Not allowed" });

    const trip_price = request.trip_price ?? 0;
    const proposed_price = request.proposed_price ?? null;
    const services_sum = request.service.length
      ? request.service.reduce((sum, s) => sum + Number(s.price), 0)
      : (request.proposed_price ?? 0);
    const total_price = request.total_price ?? 0;

    res.json({
      trip_price,
      proposed_price,
      services_sum,
      total_price,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// MECHANIC: Service history (completed/cancelled)
// ============================
export const getMechanicHistory = async (req, res) => {
  try {
    const mechanicId = req.user.id;

    const history = await prisma.serviceRequest.findMany({
      where: {
        AND: [
          { status: { in: ["completed", "cancelled"] } },
          {
            OR: [
              // Known services: requests with services from this mechanic
              { service: { some: { mechanicId } } },
              // Unknown/accepted services: mechanicId is set to this mechanic
              { mechanicId },
            ],
          },
        ],
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        service: true,
        mechanic: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { request_date: "desc" },
    });

    console.log(
      `Mechanic ${mechanicId} history: found ${history.length} requests`,
    );
    res.json(history);
  } catch (err) {
    console.error("Error fetching mechanic history:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// CUSTOMER: Get my requests
// ============================
export const getMyRequests = async (req, res) => {
  try {
    const customerId = req.user.id;
    const requests = await prisma.serviceRequest.findMany({
      where: { customerId },
      include: {
        service: true,
        mechanic: {
          select: {
            id: true,
            name: true,
            phone: true,
            mechanic_lat: true,
            mechanic_lng: true,
          },
        },
      },
      orderBy: { request_date: "desc" },
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// CUSTOMER: Cancel request
// ============================
export const cancelServiceRequest = async (req, res) => {
  try {
    const customerId = req.user.id;
    const requestId = Number(req.params.id);

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });
    if (!request)
      return res.status(404).json({ message: "Service request not found" });
    if (request.customerId !== customerId)
      return res.status(403).json({ message: "Not allowed" });
    if (!["pending", "accepted", "proposed"].includes(request.status)) {
      return res
        .status(400)
        .json({
          message: "Cannot cancel completed or already cancelled requests",
        });
    }

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: "cancelled" },
    });

    // Notify mechanic: WebSocket if online, otherwise Web Push
    if (request.mechanicId) {
      const payload = {
        message: "Customer cancelled the service request",
        request: {
          id: updatedRequest.id,
          status: updatedRequest.status,
        },
      };

      if (isUserOnline(request.mechanicId)) {
        notifyMechanic(request.mechanicId, "request_cancelled", payload);
      } else {
        await sendPushToUser(request.mechanicId, {
          type: "request_cancelled",
          title: "Request cancelled",
          body: "The customer cancelled the service request.",
          data: {
            requestId: updatedRequest.id,
            customerId,
          },
        });
      }
    }

    res.json({
      message: "Service request cancelled successfully",
      request: updatedRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}; // ============================
// CUSTOMER: Get nearby mechanics
// ============================
export const getNearbyMechanics = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    console.log("🔍 getNearbyMechanics called with:", { lat, lng });
    if (!lat || !lng)
      return res.status(400).json({ message: "Location required" });

    const customerLocation = { lat: Number(lat), lng: Number(lng) };

    // Fetch mechanics with their services
    const mechanics = await prisma.user.findMany({
      where: {
        usertype: "mechanic",
        mechanic_lat: { not: null },
        mechanic_lng: { not: null },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        mechanic_lat: true,
        mechanic_lng: true,
        working_hours: true,
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            serviceType: true,
          },
        },
      },
    });

    console.log(
      `Found ${mechanics.length} mechanics, calculating distances...`,
    );

    // Calculate ORS distance for each mechanic
    const mechanicsWithDistance = await Promise.all(
      mechanics.map(async (mechanic) => {
        try {
          const mechanicLocation = {
            lat: mechanic.mechanic_lat,
            lng: mechanic.mechanic_lng,
          };

          // Check if same location (avoid ORS API call)
          const isSameLocation =
            Math.abs(customerLocation.lat - mechanicLocation.lat) < 0.001 &&
            Math.abs(customerLocation.lng - mechanicLocation.lng) < 0.001;

          let distance;
          let tripPrice;

          if (isSameLocation) {
            console.log(
              `Same location detected for mechanic ${mechanic.id}, returning 0km`,
            );
            distance = 0;
            tripPrice = 0;
          } else {
            console.log(`Calling ORS for mechanic ${mechanic.id}`);
            const { tripDistanceKm, tripPrice: calculatedTripPrice } =
              await calculateTripPrice(customerLocation, mechanicLocation);
            distance = tripDistanceKm;
            tripPrice = calculatedTripPrice;
            console.log(
              `ORS returned ${distance}km (${tripPrice} fee) for mechanic ${mechanic.id}`,
            );
          }

          return {
            ...mechanic,
            distance: distance < 0.01 ? 0 : Math.round(distance * 100) / 100,
            trip_price: tripPrice,
            services: mechanic.service,
          };
        } catch (error) {
          console.error(
            `Failed to calculate distance for mechanic ${mechanic.id}:`,
            error.message,
          );
          // Fallback: return mechanic without distance/price
          return {
            ...mechanic,
            distance: null,
            trip_price: null,
            services: mechanic.service,
          };
        }
      }),
    );

    // Sort by distance (closest first), mechanics without distance go last
    mechanicsWithDistance.sort((a, b) => {
      if (a.distance === null) return 1;
      if (b.distance === null) return -1;
      return a.distance - b.distance;
    });

    res.json(mechanicsWithDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// MECHANIC: View incoming requests
// ============================
export const getIncomingRequests = async (req, res) => {
  try {
    const mechanicId = req.user.id;
    const requests = await prisma.serviceRequest.findMany({
      where: {
        OR: [
          { service: { some: { mechanicId } } },
          { service: { none: {} }, OR: [{ mechanicId }, { mechanicId: null }] },
        ],
        status: "pending",
      },
      include: { customer: true, service: true },
      orderBy: { request_date: "asc" },
    });
    const requestsWithDistance = await enrichRequestsWithDistance(
      requests,
      mechanicId,
    );
    res.json(requestsWithDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// MECHANIC: View all active requests (pending, proposed, accepted)
// ============================
export const getActiveRequests = async (req, res) => {
  try {
    const mechanicId = req.user.id;
    const requests = await prisma.serviceRequest.findMany({
      where: {
        OR: [
          // Known services: requests with services from this mechanic
          { service: { some: { mechanicId } } },
          // Unknown services (not accepted yet): pending requests with no services
          { service: { none: {} }, mechanicId: null },
          // Accepted unknown services OR any accepted requests: mechanicId is set
          { mechanicId },
        ],
        status: { in: ["pending", "proposed", "accepted"] },
      },
      include: {
        customer: {
    select: {
      name: true,
      phone: true
    }
  },
        service: true,
      },
      orderBy: { request_date: "asc" },
    });

    const requestsWithDistance = await enrichRequestsWithDistance(
      requests,
      mechanicId,
    );

    console.log(
      "getActiveRequests - Total requests:",
      requestsWithDistance.length,
    );
    requestsWithDistance.forEach((request, idx) => {
      console.log(
        `Request ${idx}: id=${request.id}, status=${request.status}, services=${request.service.length}, distance=${request.distance}, serviceNames=[${request.service.map((s) => s.name).join(",")}]`,
      );
    });

    res.json(requestsWithDistance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// MECHANIC: Accept request
// ============================
export const acceptServiceRequest = async (req, res) => {
  try {
    const mechanicId = req.user.id;
    const requestId = Number(req.params.id);

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { service: true },
    });

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending")
      return res
        .status(400)
        .json({ message: "Only pending requests can be accepted" });

    const canAccept =
      !request.service.length ||
      request.service.some((s) => s.mechanicId === mechanicId);
    if (!canAccept)
      return res
        .status(403)
        .json({ message: "You are not allowed to accept this request" });

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: "accepted",
        mechanicId: mechanicId, // Set the mechanic who accepted this request
      },
      include: {
        service: true,
        mechanic: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    const notificationPayload = {
      message: "Your service request has been accepted by the mechanic",
      request: {
        id: updatedRequest.id,
        status: updatedRequest.status,
        mechanic: updatedRequest.mechanic,
        service: updatedRequest.service,
      },
    };

    // Notify customer: WebSocket if online, otherwise Web Push
    if (isUserOnline(request.customerId)) {
      notifyCustomer(
        request.customerId,
        "request_accepted",
        notificationPayload,
      );
    } else {
      await sendPushToUser(request.customerId, {
        type: "request_accepted",
        title: "Request accepted",
        body: "Your service request has been accepted by the mechanic.",
        data: {
          requestId: updatedRequest.id,
          mechanicId,
        },
      });
    }

    res.json({ message: "Request accepted", request: updatedRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// MECHANIC: Reject request
// ============================
export const rejectServiceRequest = async (req, res) => {
  try {
    const mechanicId = req.user.id;
    const requestId = Number(req.params.id);

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { service: true },
    });

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "pending")
      return res
        .status(400)
        .json({ message: "Only pending requests can be rejected" });

    const canReject =
      !request.service.length ||
      request.service.some((s) => s.mechanicId === mechanicId);
    if (!canReject)
      return res
        .status(403)
        .json({ message: "You are not allowed to reject this request" });

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: {
        status: "cancelled",
        mechanicId: mechanicId, // Set mechanic who rejected it for history tracking
      },
      include: {
        service: true,
        mechanic: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
      },
    });

    const notificationPayload = {
      message: "Your service request has been rejected by the mechanic",
      request: {
        id: updatedRequest.id,
        status: updatedRequest.status,
        mechanic: updatedRequest.mechanic,
        service: updatedRequest.service,
      },
    };

    // Notify customer: WebSocket if online, otherwise Web Push
    if (isUserOnline(request.customerId)) {
      notifyCustomer(
        request.customerId,
        "request_rejected",
        notificationPayload,
      );
    } else {
      await sendPushToUser(request.customerId, {
        type: "request_rejected",
        title: "Request rejected",
        body: "Your service request has been rejected by the mechanic.",
        data: {
          requestId: updatedRequest.id,
          mechanicId,
        },
      });
    }

    res.json({ message: "Request rejected", request: updatedRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// MECHANIC: Complete request
// ============================
export const completeServiceRequest = async (req, res) => {
  try {
    const mechanicId = req.user.id;
    const requestId = Number(req.params.id);

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { service: true },
    });

    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "accepted")
      return res
        .status(400)
        .json({ message: "Only accepted requests can be completed" });

    const isAllowed =
      !request.service.length ||
      request.service.some((s) => s.mechanicId === mechanicId);
    if (!isAllowed)
      return res
        .status(403)
        .json({ message: "You are not allowed to complete this request" });

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: "completed" },
    });

    // Notify customer that request is completed
    if (isUserOnline(request.customerId)) {
      notifyCustomer(request.customerId, "request_completed", {
        message: "Your service request has been completed",
        request: {
          id: updatedRequest.id,
          status: updatedRequest.status,
        },
      });
    } else {
      await sendPushToUser(request.customerId, {
        type: "request_completed",
        title: "Request completed",
        body: "Your service request has been completed.",
        data: {
          requestId: updatedRequest.id,
          mechanicId,
        },
      });
    }

    res.json({ message: "Request completed", request: updatedRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// MECHANIC: Propose price
// ============================
export const proposeServicePrice = async (req, res) => {
  try {
    const mechanicId = req.user.id;
    const requestId = Number(req.params.id);
    const { proposed_price } = req.body;

    if (!proposed_price || proposed_price <= 0) {
      return res.status(400).json({ message: "Invalid price" });
    }

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { service: true },
    });
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.status !== "accepted")
      return res
        .status(400)
        .json({ message: "Price can only be proposed for accepted requests" });

    const canPropose =
      !request.service.length ||
      request.service.some((s) => s.mechanicId === mechanicId);
    if (!canPropose)
      return res
        .status(403)
        .json({
          message: "You are not allowed to propose price for this request",
        });

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { proposed_price, customerApproved: null, status: "proposed" },
    });

    // Notify customer: WebSocket if online, otherwise Web Push
    const pricePayload = {
      message: "Mechanic proposed a new price",
      request: {
        id: updatedRequest.id,
        proposed_price: updatedRequest.proposed_price,
        status: updatedRequest.status,
      },
    };

    if (isUserOnline(request.customerId)) {
      notifyCustomer(request.customerId, "price_proposed", pricePayload);
    } else {
      await sendPushToUser(request.customerId, {
        type: "price_proposed",
        title: "New price proposed",
        body: "Your mechanic has proposed a new price for your service request.",
        data: {
          requestId: updatedRequest.id,
          mechanicId,
        },
      });
    }

    res.json({
      message: "Price proposed successfully",
      request: updatedRequest,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
