import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3000';

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if not authenticated
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('No auth token found for socket connection');
      return;
    }

    // Create socket connection with auth token
    const newSocket = io(SOCKET_URL, {
      auth: {
        token: token,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('✅ Socket.IO connected:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Socket.IO disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount or auth change
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [isAuthenticated, user]);

  // Listen for notification events
  useEffect(() => {
    if (!socket) return;

    const eventHandlers = {
      new_service_request: (data) => {
        console.log('📨 New service request:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'new_service_request', data } }));
      },
      request_accepted: (data) => {
        console.log('✅ Request accepted:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'request_accepted', data } }));
      },
      request_rejected: (data) => {
        console.log('❌ Request rejected:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'request_rejected', data } }));
      },
      request_completed: (data) => {
        console.log('✅ Request completed:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'request_completed', data } }));
      },
      price_proposed: (data) => {
        console.log('💰 Price proposed:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'price_proposed', data } }));
      },
      price_accepted: (data) => {
        console.log('✅ Price accepted:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'price_accepted', data } }));
      },
      price_declined: (data) => {
        console.log('❌ Price declined:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'price_declined', data } }));
      },
      request_cancelled: (data) => {
        console.log('🚫 Request cancelled:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'request_cancelled', data } }));
      },
      request_expired: (data) => {
        console.log('⏰ Request expired:', data);
        window.dispatchEvent(new CustomEvent('notification', { detail: { type: 'request_expired', data } }));
      },
    };

    // Register all event handlers
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup
    return () => {
      Object.keys(eventHandlers).forEach((event) => {
        socket.off(event);
      });
    };
  }, [socket]);

  const value = {
    socket,
    isConnected,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
