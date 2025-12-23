import express from "express"
import { authenticateToken } from "../middleware/authMiddleware.js"
import { isMechanic } from "../middleware/rolebase.js"
import {
  createService,
  getMyServices,
  updateService,
  deleteService
} from "../controller/service.js"

const serviceRoutes = express.Router()

// MECHANIC creates a service
serviceRoutes.post("/", authenticateToken, isMechanic, createService)

// MECHANIC views all own services
serviceRoutes.get("/my", authenticateToken, isMechanic, getMyServices)

// MECHANIC updates a service
serviceRoutes.put("/:id", authenticateToken, isMechanic, updateService)

// MECHANIC deletes a service
serviceRoutes.delete("/:id", authenticateToken, isMechanic, deleteService)

export default serviceRoutes
