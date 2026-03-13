import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
  saveSubscription,
  deleteSubscription,
  getPublicKey,
} from "../service/pushService.js";

const router = express.Router();

// Public endpoint for VAPID public key (used by frontend to subscribe)
router.get("/public-key", getPublicKey);

// Authenticated routes for managing subscriptions
router.use(authenticateToken);

// Save or update a web push subscription for the authenticated user
router.post("/subscribe", saveSubscription);

// Delete a web push subscription for the authenticated user
router.post("/unsubscribe", deleteSubscription);

export default router;
