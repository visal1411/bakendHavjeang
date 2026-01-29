import express from "express"
import { authenticateToken } from "../middleware/authMiddleware.js"
import { isMechanic } from "../middleware/rolebase.js"
import { requireFirstService } from "../middleware/serviceRequire.js"
import {
  createService,
  getMyServices,
  updateService,
  deleteService,

} from "../controller/service.js"

const serviceRoutes = express.Router()

// MECHANIC creates a service
serviceRoutes.post("/", authenticateToken, isMechanic, requireFirstService, createService)

// MECHANIC views all own services
serviceRoutes.get("/my", authenticateToken, isMechanic, requireFirstService, getMyServices)

// MECHANIC updates a service
serviceRoutes.put("/:id", authenticateToken, isMechanic, requireFirstService, updateService)

// MECHANIC deletes a service
serviceRoutes.delete("/:id", authenticateToken, isMechanic, requireFirstService, deleteService)



export default serviceRoutes
