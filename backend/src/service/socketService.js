// src/service/socketService.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Store user socket connections: userId -> Set<socketId>
const userSockets = new Map();

/**
 * Initialize Socket.IO with authentication and event handlers
 */
export const initializeSocket = (io) => {
  // Set global io instance
  ioInstance = io;
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const rawToken =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization ||
        socket.handshake.headers.token;
      const token =
        typeof rawToken === 'string' && rawToken.startsWith('Bearer ')
          ? rawToken.slice(7)
          : rawToken;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.id;
      socket.userType = decoded.usertype || decoded.role;

      if (!socket.userId || !socket.userType) {
        return next(new Error('Authentication error: Invalid token payload'));
      }

      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.userId;
    const userType = socket.userType;

    console.log(`User connected: ${userId} (${userType})`);

    // Store user socket connection (supports multiple tabs/devices)
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    // Join user-specific room for notifications
    socket.join(`user_${userId}`);

    // If user is a mechanic, join mechanic room for receiving service requests
    // if (userType === 'mechanic') {
    //   socket.join('mechanics');
    //   console.log(`Mechanic ${userId} joined mechanics room`);
    // }

    // If user is a customer, join customer room
    if (userType === 'customer') {
      socket.join('customers');
      console.log(`Customer ${userId} joined customers room`);
    }

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${userId}`);
      const sockets = userSockets.get(userId);
      if (!sockets) return;

      sockets.delete(socket.id);
      if (!sockets.size) {
        userSockets.delete(userId);
      }
    });
  });
};

/**
 * Get Socket.IO instance
 */
let ioInstance = null;
export const setIoInstance = (io) => {
  ioInstance = io;
};

/**
 * Emit notification to a specific user by their userId
 */
export const notifyUser = (userId, event, data) => {
  if (!ioInstance) {
    console.warn('Socket.IO instance not initialized');
    return;
  }

  ioInstance.to(`user_${userId}`).emit(event, data);
  console.log(`Notification sent to user ${userId}: ${event}`, data);
};

/**
 * Check if user is currently connected to Socket.IO.
 * Used to decide WebSocket (online) vs Web Push (offline).
 */
export const isUserOnline = (userId) => {
  if (userId == null) return false;
  const sockets = userSockets.get(userId);
  return Boolean(sockets && sockets.size > 0);
};

/**
 * Emit notification to all mechanics
 */
// export const notifyAllMechanics = (event, data) => {
//   if (!ioInstance) {
//     console.warn('Socket.IO instance not initialized');
//     return;
//   }

//   ioInstance.to('mechanics').emit(event, data);
//   console.log(`Notification sent to all mechanics: ${event}`, data);
// };

/**
 * Emit notification to a specific mechanic
 */
export const notifyMechanic = (mechanicId, event, data) => {
  notifyUser(mechanicId, event, data);
};

/**
 * Emit notification to a specific customer
 */
export const notifyCustomer = (customerId, event, data) => {
  notifyUser(customerId, event, data);
};
