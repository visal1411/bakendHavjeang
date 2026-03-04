import { prisma } from "../config/db.js";
import { isUserOnline, notifyCustomer, notifyMechanic } from "./socketService.js";
import { sendPushToUser } from "./pushService.js";

// Expiry duration in minutes for pending service requests.
// You can override this with REQUEST_EXPIRY_MINUTES in your .env (e.g. 10 or 30).
const EXPIRY_MINUTES = Number(process.env.REQUEST_EXPIRY_MINUTES || 10);
const CHECK_INTERVAL_MS = 60 * 1000; // run every 1 minute

export const startRequestExpiryScheduler = () => {
  if (!EXPIRY_MINUTES || Number.isNaN(EXPIRY_MINUTES) || EXPIRY_MINUTES <= 0) {
    console.warn(
      "REQUEST_EXPIRY_MINUTES is not set or invalid; request auto-expiry scheduler is disabled."
    );
    return;
  }

  console.log(
    `ServiceRequest expiry scheduler started: pending requests older than ${EXPIRY_MINUTES} minutes will be auto-cancelled.`
  );

  setInterval(async () => {
    const cutoff = new Date(Date.now() - EXPIRY_MINUTES * 60 * 1000);

    try {
      // Find all pending requests that are older than the cutoff
      const expiredRequests = await prisma.serviceRequest.findMany({
        where: {
          status: "pending",
          request_date: {
            lt: cutoff
          }
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true
            }
          },
          mechanic: {
            select: {
              id: true,
              name: true
            }
          },
          service: {
            select: {
              mechanicId: true
            }
          }
        }
      });

      if (!expiredRequests.length) {
        return;
      }

      // Update each request individually to set the correct mechanicId
      for (const request of expiredRequests) {
        const mechanicId = request.mechanicId || request.service[0]?.mechanicId;
        
        await prisma.serviceRequest.update({
          where: { id: request.id },
          data: { 
            status: "cancelled",
            mechanicId: mechanicId || undefined
          }
        });
      }

      // Notify affected users
      for (const request of expiredRequests) {
        const { id, customer, mechanic } = request;

        // Notify customer (considered as mechanic did not respond in time)
        if (customer?.id) {
          const wsPayload = {
            message:
              "Your service request expired because the mechanic did not respond in time.",
            request: {
              id,
              status: "cancelled"
            }
          };

          if (isUserOnline(customer.id)) {
            notifyCustomer(customer.id, "request_expired", wsPayload);
          } else {
            await sendPushToUser(customer.id, {
              type: "request_expired",
              title: "Service request expired",
              body:
                "Your service request has been automatically cancelled because the mechanic did not respond in time.",
              data: {
                requestId: id
              }
            });
          }
        }

        // Optionally notify mechanic that the request timed out
        if (mechanic?.id) {
          const wsPayloadMech = {
            message: "A pending service request assigned to you has expired.",
            request: {
              id,
              status: "cancelled"
            }
          };

          if (isUserOnline(mechanic.id)) {
            notifyMechanic(mechanic.id, "request_expired", wsPayloadMech);
          } else {
            await sendPushToUser(mechanic.id, {
              type: "request_expired",
              title: "Service request expired",
              body:
                "A pending service request assigned to you has expired due to no response in time.",
              data: {
                requestId: id
              }
            });
          }
        }
      }
    } catch (err) {
      console.error("Error while expiring old service requests", err);
    }
  }, CHECK_INTERVAL_MS);
};

