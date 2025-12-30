import { prisma } from "../config/db.js"
import { calculateTripAndTotalPrice } from "../service/pricingService.js"
//
// ============================
// CUSTOMER: Create service request
// ============================
//


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
