import { prisma } from "../config/db.js"

//
// ============================
// CUSTOMER: Create service request
// ============================
//
export const createServiceRequest = async (req, res) => {
  try {
    const customerId = req.user.id
    const {
      serviceId,
      description,
      address,
      request_lat,
      request_lan
    } = req.body

    // Validate required fields (description is optional)
    if (
      !serviceId ||
      !address ||
      request_lat === undefined ||
      request_lan === undefined
    ) {
      return res.status(400).json({
        message: "Missing required fields"
      })
    }

    // Check service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      })
    }

    // Create service request
    const request = await prisma.serviceRequest.create({
      data: {
        customerId,
        serviceId,
        description, // optional
        address,
        request_lat,
        request_lan,
        status: "pending"
      }
    })

    res.status(201).json({
      message: "Service request created successfully",
      request
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
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
          mechanicId
        },
        status: "pending"
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        service: true
      },
      orderBy: {
        request_date: "asc"
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

    if (request.service.mechanicId !== mechanicId) {
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
