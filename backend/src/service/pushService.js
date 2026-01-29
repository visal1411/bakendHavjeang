import webpush from "web-push";
import { prisma } from "../config/db.js";

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@example.com";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  console.warn(
    "Web Push VAPID keys are not set. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in your environment to enable web push."
  );
}

export const saveSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { endpoint, keys } = req.body || {};

    if (!endpoint || !keys || !keys.p256dh || !keys.auth) {
      return res.status(400).json({ message: "Invalid subscription payload" });
    }

    const subscription = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userId
      }
    });

    res.status(201).json({ message: "Subscription saved", subscriptionId: subscription.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const { endpoint } = req.body || {};

    if (!endpoint) {
      return res.status(400).json({ message: "Endpoint is required" });
    }

    await prisma.pushSubscription.deleteMany({
      where: {
        endpoint,
        userId
      }
    });

    res.status(200).json({ message: "Subscription deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendPushToUser = async (userId, payload) => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    // Web push not configured
    return;
  }

  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId }
    });

    if (!subscriptions.length) return;

    const notificationPayload =
      typeof payload === "string" ? payload : JSON.stringify(payload);

    await Promise.all(
      subscriptions.map(async (sub) => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };

        try {
          await webpush.sendNotification(pushSubscription, notificationPayload);
        } catch (error) {
          console.error("Error sending push notification", error);

          if (error.statusCode === 410 || error.statusCode === 404) {
            // Subscription is no longer valid, remove it
            await prisma.pushSubscription.delete({
              where: { endpoint: sub.endpoint }
            });
          }
        }
      })
    );
  } catch (err) {
    console.error("sendPushToUser failed", err);
  }
};