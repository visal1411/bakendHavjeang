import { prisma } from "../config/db.js"
import { calculateTripAndTotalPrice } from "../service/pricingService.js"
//
// ============================
// CUSTOMER: Create service request
// ============================
//
import { getDistanceKmORS } from "../service/distance/orsDistance.js"

export const getNearbyMechanics = async (req, res) => {
  try {
    const { lat, lng } = req.query

    if (!lat || !lng) {
      return res.status(400).json({ message: "Location required" })
    }

    const customerLocation = {
      lat: Number(lat),
      lng: Number(lng)
    }

    const mechanics = await prisma.user.findMany({
      where: {
        usertype: "mechanic",
        mechanic_lat: { not: null },
        mechanic_lng: { not: null }
      },
      select: {
        id: true,
        name: true,
        phone: true,
        mechanic_lat: true,
        mechanic_lng: true,
        service: true
      }
    })

    const MAX_DISTANCE_KM = 5

    const mechanicsWithDistance = await Promise.all(
      mechanics.map(async (m) => {
        const mechanicLocation = {
          lat: m.mechanic_lat,
          lng: m.mechanic_lng
        }

        try {
          const distanceKm = await getDistanceKmORS(
            customerLocation,
            mechanicLocation
          )

          return {
            ...m,
            distanceKm
          }
        } catch (err) {
          // If ORS fails for one mechanic, we skip them
          return null
        }
      })
    )

    const nearby = mechanicsWithDistance
      .filter(m => m && m.distanceKm <= MAX_DISTANCE_KM)
      .sort((a, b) => a.distanceKm - b.distanceKm)

    res.json(nearby)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}


export const createServiceRequest = async (req, res) => {
  try {
    const customerId = req.user.id
    const { serviceIds, description, address, request_lng, request_lat } = req.body

    if (
      !Array.isArray(serviceIds) ||
      !serviceIds.length ||
      !address ||
      request_lat === undefined ||
      request_lng === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const services = await prisma.service.findMany({
      where: { id: { in: serviceIds } },
      include: {
        mechanic: {
          select: {
            mechanic_lat: true,
            mechanic_lng: true
          }
        }
      }
    })

    if (!services.length) {
      return res.status(400).json({ message: "Selected services not found" })
    }

    for (const s of services) {
      if (s.mechanic.mechanic_lat == null || s.mechanic.mechanic_lng == null) {
        return res.status(400).json({
          message: `Mechanic location missing for service ID ${s.id}`
        })
      }
    }

    const customerLocation = {
      lat: request_lat,
      lng: request_lng
    }

    const { tripDistanceKm, tripPrice, totalPrice } =
      await calculateTripAndTotalPrice(customerLocation, services)

    const request = await prisma.serviceRequest.create({
      data: {
        customerId,
        description,
        address,
        request_lat,
        request_lng,
        trip_price: tripPrice,
        total_price: totalPrice,
        status: "pending",
        service: {
          connect: serviceIds.map(id => ({ id }))
        }
      },
      include: { service: true }
    })

    res.status(201).json({
      ...request,
      tripDistanceKm,
      tripPrice,
      totalPrice
    })
  } catch (error) {
    console.error("Service request creation error:", error)
    res.status(500).json({ message: error.message })
  }
}

//
// ============================
// CUSTOMER: Get my service requests
// ============================
//

export const getMyRequests = async (req, res) => {
  try {
    const customerId = req.user.id

    const requests = await prisma.serviceRequest.findMany({
      where: { customerId },
      include: {
        service: {
          include: {
            mechanic: {
              select: {
                id: true,
                name: true,
                phone: true
              }
            }
          }
        }
      },
      orderBy: {
        request_date: "desc"
      }
    })

    res.json(requests)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

//
// ============================
// CUSTOMER: Cancel service request
// ============================
//
export const cancelServiceRequest = async (req, res) => {
  try {
    const customerId = req.user.id
    const requestId = Number(req.params.id)

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId }
    })

    if (!request) {
      return res.status(404).json({
        message: "Service request not found"
      })
    }

    if (request.customerId !== customerId) {
      return res.status(403).json({
        message: "You are not allowed to cancel this request"
      })
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be cancelled"
      })
    }

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: "cancelled" }
    })


    res.json({
      message: "Service request cancelled successfully",
      request: updatedRequest
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}


// customer view mehcanic's services
// ================= GET MECHANIC BY ID =================
export const getMechanicById = async (req, res) => {
  try {
    const { id } = req.params

    const mechanic = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        phone: true,
        usertype: true,
        mechanic_lat: true,
        mechanic_lng: true,
        working_hours: true
      }
    })

    if (!mechanic || mechanic.usertype.toLowerCase() !== "mechanic") {
      return res.status(404).json({ message: "Mechanic not found" })
    }

    res.status(200).json({
      message: "Mechanic fetched successfully",
      mechanic
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}


// // GET /service/mechanic/:mechanicId
export const getServicesByMechanic = async (req, res) => {
  try {
    const mechanicId = parseInt(req.params.mechanicId, 10)

    const services = await prisma.service.findMany({
      where: { mechanicId }
    })

    res.json(services)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}


//
// ============================
// MECHANIC: View incoming service requests
// ============================
//
export const getIncomingRequests = async (req, res) => {
  try {
    const mechanicId = req.user.id

    const requests = await prisma.serviceRequest.findMany({
      where: {
        service: {
          some: {
            mechanicId
          }
        },
        status: "pending"
      },
      include: {
        customer: {
          select: { id: true, name: true, phone: true }
        },
        service: true
      },
      orderBy: { request_date: "asc" }
    })

    if (requests.length === 0) {
      return res.json({ message: "No incoming service requests", data: [] })
    }

    res.json(requests)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "no service requests found" })
  }
}

//
// ============================
// MECHANIC: Complete service request
// ============================
//
export const completeServiceRequest = async (req, res) => {
  try {
    const mechanicId = req.user.id
    const requestId = Number(req.params.id)

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { service: true }
    })

    if (!request) {
      return res.status(404).json({
        message: "Service request not found"
      })
    }
    const isAllowed = request.service.some(
      s => s.mechanicId === mechanicId
    )

    if (!isAllowed) {
      return res.status(403).json({
        message: "You are not allowed to update this request"
      })
    }

    if (request.status !== "accepted") {
      return res.status(400).json({
        message: "Only accepted requests can be completed"
      })
    }


    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: "completed" }
    })

    res.json({
      message: "Service request completed successfully",
      request: updatedRequest
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

//
// ============================
// MECHANIC: Accept service request
// ============================
//
export const acceptServiceRequest = async (req, res) => {
  try {
    const mechanicId = req.user.id
    const requestId = Number(req.params.id)

    const request = await prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { service: true },
    })

    if (!request) {
      return res.status(404).json({ message: "Service request not found" })
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be accepted"
      })
    }

    // Ensure this request belongs to this mechanic
    const belongsToMechanic = request.service.some(
      s => s.mechanicId === mechanicId
    )

    if (!belongsToMechanic) {
      return res.status(403).json({
        message: "You are not allowed to accept this request"
      })
    }

    const updatedRequest = await prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: "accepted" }
    })

    res.json({
      message: "Service request accepted",
      request: updatedRequest
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

