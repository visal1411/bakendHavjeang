import { io } from 'socket.io-client';

const SOCKET_PATH = '/socket.io';
let socket = null;

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  if (import.meta.env.DEV) {
    return 'http://localhost:8080';
  }

  return window.location.origin;
};

const realtimeService = {
  connect: (token, handlers = {}) => {
    if (!token) return null;

    if (socket) {
      socket.disconnect();
      socket = null;
    }

    socket = io(getSocketUrl(), {
      path: SOCKET_PATH,
      transports: ['websocket', 'polling'],
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 8,
      reconnectionDelay: 1000,
      timeout: 8000,
      withCredentials: true,
    });

    const {
      onConnect,
      onDisconnect,
      onError,
      onEvent,
    } = handlers;

    socket.on('connect', () => {
      if (typeof onConnect === 'function') {
        onConnect(socket.id);
      }
    });

    socket.on('disconnect', (reason) => {
      if (typeof onDisconnect === 'function') {
        onDisconnect(reason);
      }
    });

    socket.on('connect_error', (error) => {
      if (typeof onError === 'function') {
        onError(error);
      }
    });

    const events = [
      'new_service_request',
      'request_accepted',
      'request_rejected',
      'request_completed',
      'request_cancelled',
      'request_expired',
      'price_accepted',
      'price_declined',
      'price_proposed',
    ];

    events.forEach((eventName) => {
      socket.on(eventName, (payload) => {
        if (typeof onEvent === 'function') {
          onEvent(eventName, payload);
        }
      });
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  isConnected: () => Boolean(socket?.connected),
};

export default realtimeService;
