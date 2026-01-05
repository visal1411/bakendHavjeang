// src/routes/serviceRequestRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { isCustomer, isMechanic } from "../middleware/rolebase.js";
import {
  getNearbyMechanics,
  createServiceRequest,
  getMyRequests,
  cancelServiceRequest,
  getIncomingRequests,
  completeServiceRequest,
  getServicesByMechanic,
  getMechanicById,
  acceptServiceRequest
} from "../controller/serviceRequest.js";

const serviceRequestRoutes = express.Router();

// =====================
// CUSTOMER ROUTES
// =====================

// Customer creates service request
serviceRequestRoutes.post("/", authenticateToken, isCustomer, createServiceRequest);

// Customer views own requests
serviceRequestRoutes.get("/my", authenticateToken, isCustomer, getMyRequests);

// Customer cancels request
serviceRequestRoutes.patch("/:id/cancel", authenticateToken, isCustomer, cancelServiceRequest);

serviceRequestRoutes.get("/nearby", authenticateToken, isCustomer, getNearbyMechanics);

// Get mechanic details by ID
serviceRequestRoutes.get("/mechanic/:id", authenticateToken, isCustomer, getMechanicById);

// Customer view all services by a mechanic
serviceRequestRoutes.get("/service/:mechanicId", authenticateToken, isCustomer, getServicesByMechanic)

// =====================
// MECHANIC ROUTES
// =====================

// Mechanic views incoming requests
serviceRequestRoutes.get("/incoming", authenticateToken, isMechanic, getIncomingRequests);

// Mechanic completes request
serviceRequestRoutes.patch("/:id/complete", authenticateToken, isMechanic, completeServiceRequest);

// Mechanic accepts request
serviceRequestRoutes.patch("/:id/accept", authenticateToken, isMechanic, acceptServiceRequest);

export default serviceRequestRoutes;
