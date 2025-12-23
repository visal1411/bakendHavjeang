// src/routes/serviceRequestRoutes.js
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { isCustomer, isMechanic } from "../middleware/rolebase.js";
import {
  createServiceRequest,
  getMyRequests,
  cancelServiceRequest,
  getIncomingRequests,
  completeServiceRequest
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

// =====================
// MECHANIC ROUTES
// =====================

// Mechanic views incoming requests
serviceRequestRoutes.get("/incoming", authenticateToken, isMechanic, getIncomingRequests);

// Mechanic completes request
serviceRequestRoutes.patch("/:id/complete", authenticateToken, isMechanic, completeServiceRequest);

export default serviceRequestRoutes;
