// src/routes/serviceRequestRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { isCustomer, isMechanic } from "../middleware/rolebase.js";
import {
  createServiceRequest,
  getMyRequests,
  cancelServiceRequest,
  getIncomingRequests,
  getActiveRequests,
  completeServiceRequest,
  getNearbyMechanics,
  acceptServiceRequest,
  rejectServiceRequest,
  getMechanicById,
  getServicesByMechanic,
  acceptProposedPrice,
  declineProposedPrice,
  proposeServicePrice,
  getRequestTotal,
  getMechanicHistory,
} from "../controller/serviceRequest.js";

const router = express.Router();

// =====================
// CUSTOMER ROUTES
// =====================
const customerRouter = express.Router();

customerRouter.use(authenticateToken, isCustomer);

// Create service request (known or unknown)
customerRouter.post("/", createServiceRequest);

// View own requests
customerRouter.get("/my", getMyRequests);

// Get grand total for a request (trip + services)
customerRouter.get("/:id/total", getRequestTotal);

// Cancel request
customerRouter.patch("/:id/cancel", cancelServiceRequest);

// Get nearby mechanics
customerRouter.get("/nearby", getNearbyMechanics);

// Get mechanic info
customerRouter.get("/:id/info", getMechanicById);

// Get all services by a mechanic
customerRouter.get("/:mechanicId/services", getServicesByMechanic);

// Accept proposed price
customerRouter.patch("/:id/accept-price", acceptProposedPrice);

// Decline proposed price
customerRouter.patch("/:id/decline-price", declineProposedPrice);

router.use("/customer", customerRouter);

// =====================
// MECHANIC ROUTES
// =====================
const mechanicRouter = express.Router();

mechanicRouter.use(authenticateToken, isMechanic);

// View incoming requests (pending only)
mechanicRouter.get("/incoming", getIncomingRequests);

// View all active requests (pending, proposed, accepted)
mechanicRouter.get("/active", getActiveRequests);

// View completed/cancelled history
mechanicRouter.get("/history", getMechanicHistory);

// Accept request
mechanicRouter.patch("/:id/accept", acceptServiceRequest);

// Reject request
mechanicRouter.patch("/:id/reject", rejectServiceRequest);

// Complete request
mechanicRouter.patch("/:id/complete", completeServiceRequest);

// Propose service price
mechanicRouter.patch("/:id/propose-price", proposeServicePrice);

router.use("/mechanic", mechanicRouter);

export default router;
