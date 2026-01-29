import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { saveSubscription, deleteSubscription } from "../service/pushService.js";

const router = express.Router();

router.use(authenticateToken);

// Save or update a web push subscription for the authenticated user
router.post("/subscribe", saveSubscription);

// Delete a web push subscription for the authenticated user
router.post("/unsubscribe", deleteSubscription);

export default router;

