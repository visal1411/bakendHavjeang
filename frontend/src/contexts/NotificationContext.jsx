import { useCallback, useEffect, useRef, useState } from 'react';
import { pushService, realtimeService, serviceRequestsService } from '@/services';
import { useAuth } from './AuthContext';
import { NotificationContext } from './notificationContextInstance';

const POLLING_INTERVAL_MS = 15000;
const NOTIFICATION_STORAGE_PREFIX = 'hav_jeang_notifications';

const EVENT_TEMPLATES = {
  new_service_request: {
    title: 'New Service Request',
    message: 'A new service request is waiting for your response.',
  },
  request_accepted: {
    title: 'Request Accepted',
    message: 'Your service request has been accepted.',
  },
  request_rejected: {
    title: 'Request Rejected',
    message: 'A mechanic rejected your service request.',
  },
  request_completed: {
    title: 'Request Completed',
    message: 'The mechanic completed your job.',
  },
  request_cancelled: {
    title: 'Request Cancelled',
    message: 'A service request was cancelled.',
  },
  request_expired: {
    title: 'Request Expired',
    message: 'A pending service request expired.',
  },
  price_accepted: {
    title: 'Price Accepted',
    message: 'The customer accepted your proposed price.',
  },
  price_declined: {
    title: 'Price Declined',
    message: 'The customer declined your proposed price.',
  },
  price_proposed: {
    title: 'Price Proposed',
    message: 'A mechanic proposed a service price update.',
  },
  system_event: {
    title: 'System Update',
    message: 'There is an important system update.',
  },
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const routeByUserType = (userType) => {
  if (userType === 'mechanic') return '/mechanic/dashboard';
  if (userType === 'customer') return '/customer/home';
  return '/';
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const notificationStorageKey = `${NOTIFICATION_STORAGE_PREFIX}_${user?.id ?? 'guest'}`;

  const [notifications, setNotifications] = useState([]);
  const [notificationPermission, setNotificationPermission] = useState(
    typeof Notification !== 'undefined' ? Notification.permission : 'default',
  );
  const [socketConnected, setSocketConnected] = useState(false);

  const pollingRef = useRef(null);
  const serviceWorkerRegistrationRef = useRef(null);
  const snapshotRef = useRef(new Map());
  const userTypeRef = useRef(user?.usertype);
  const notificationPermissionRef = useRef(notificationPermission);
  const addNotificationRef = useRef(() => {});

  const scheduleNotificationState = useCallback((nextValue) => {
    queueMicrotask(() => {
      setNotifications(nextValue);
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      scheduleNotificationState([]);
      return;
    }

    try {
      const raw = localStorage.getItem(notificationStorageKey);
      if (!raw) {
        scheduleNotificationState([]);
        return;
      }

      const parsed = JSON.parse(raw);
      scheduleNotificationState(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
      scheduleNotificationState([]);
    }
  }, [isAuthenticated, notificationStorageKey, scheduleNotificationState, user?.id]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;
    localStorage.setItem(notificationStorageKey, JSON.stringify(notifications));
  }, [isAuthenticated, notificationStorageKey, notifications, user?.id]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const emitBrowserNotification = useCallback(async (title, message, data = {}) => {
    if (notificationPermissionRef.current !== 'granted') return;
    if (document.visibilityState === 'visible') return;

    try {
      const registration = serviceWorkerRegistrationRef.current;

      if (registration?.showNotification) {
        await registration.showNotification(title, {
          body: message,
          data,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: data.type || 'general',
        });
        return;
      }

      new Notification(title, {
        body: message,
        data,
      });
    } catch (error) {
      console.error('Browser notification failed:', error);
    }
  }, []);

  const addNotification = useCallback((eventName, payload = {}, source = 'system') => {
    const template = EVENT_TEMPLATES[eventName] || EVENT_TEMPLATES.system_event;
    const title = payload?.title || template.title;
    const message = payload?.message || payload?.body || template.message;

    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type: eventName,
      source,
      title,
      message,
      data: payload?.data || payload?.request || null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((current) => [entry, ...current].slice(0, 50));

    emitBrowserNotification(title, message, {
      ...(payload?.data || {}),
      path: routeByUserType(userTypeRef.current),
      type: eventName,
    });
  }, [emitBrowserNotification]);

  useEffect(() => {
    userTypeRef.current = user?.usertype;
    notificationPermissionRef.current = notificationPermission;
  }, [user?.usertype, notificationPermission]);

  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  const dismissNotification = (id) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      return 'denied';
    }

    if (Notification.permission === 'granted') {
      setNotificationPermission('granted');
      return 'granted';
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission;
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      realtimeService.disconnect();
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      snapshotRef.current = new Map();
      return;
    }

    let active = true;

    const normalizeStatusSnapshot = (items) => {
      const next = new Map();
      items.forEach((item) => {
        if (item?.id) {
          next.set(item.id, item.status || 'pending');
        }
      });
      return next;
    };

    const processPollingDiff = (items) => {
      const previous = snapshotRef.current;
      const next = normalizeStatusSnapshot(items);

      if (!previous.size) {
        snapshotRef.current = next;
        return;
      }

      next.forEach((status, id) => {
        const oldStatus = previous.get(id);

        if (!oldStatus) {
          addNotificationRef.current(
            'new_service_request',
            {
              message: `A new request #${id} has arrived.`,
              data: { requestId: id },
            },
            'polling',
          );
          return;
        }

        if (oldStatus !== status) {
          addNotificationRef.current(
            `request_${status}`,
            {
              message: `Request #${id} moved from ${oldStatus} to ${status}.`,
              data: { requestId: id },
            },
            'polling',
          );
        }
      });

      snapshotRef.current = next;
    };

    const pollNotifications = async () => {
      try {
        if (userTypeRef.current === 'mechanic') {
          const requests = await serviceRequestsService.getActiveRequests();
          processPollingDiff(Array.isArray(requests) ? requests : []);
          return;
        }

        if (userTypeRef.current === 'customer') {
          const requests = await serviceRequestsService.getMyRequests();
          processPollingDiff(Array.isArray(requests) ? requests : []);
        }
      } catch (error) {
        console.error('Notification polling failed:', error);
      }
    };

    const stopPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };

    const startPolling = () => {
      if (pollingRef.current) return;
      pollNotifications();
      pollingRef.current = setInterval(() => {
        pollNotifications();
      }, POLLING_INTERVAL_MS);
    };

    const registerServiceWorker = async () => {
      if (!('serviceWorker' in navigator)) return null;

      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        serviceWorkerRegistrationRef.current = registration;
        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        return null;
      }
    };

    const subscribeToPush = async (registration) => {
      if (!registration || !('PushManager' in window)) return;

      try {
        const { publicKey } = await pushService.getPublicKey();
        if (!publicKey) return;

        const existing = await registration.pushManager.getSubscription();
        const browserSubscription =
          existing ||
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          }));

        await pushService.subscribe(browserSubscription);
      } catch (error) {
        console.error('Push subscription failed:', error);
      }
    };

    const initialize = async () => {
      const registration = await registerServiceWorker();
      const permission = await requestNotificationPermission();

      if (permission === 'granted') {
        await subscribeToPush(registration);
      }

      const token = localStorage.getItem('hav_jeang_token');
      if (!token) {
        startPolling();
        return;
      }

      realtimeService.connect(token, {
        onConnect: () => {
          if (!active) return;
          setSocketConnected(true);
          stopPolling();
        },
        onDisconnect: () => {
          if (!active) return;
          setSocketConnected(false);
          startPolling();
        },
        onError: () => {
          if (!active) return;
          setSocketConnected(false);
          startPolling();
        },
        onEvent: (eventName, payload) => {
          if (!active) return;
          addNotificationRef.current(eventName, payload, 'socket');
        },
      });
    };

    initialize();

    return () => {
      active = false;
      realtimeService.disconnect();
      stopPolling();
    };
  }, [isAuthenticated, user?.id]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        socketConnected,
        notificationPermission,
        addNotification,
        markAllRead,
        dismissNotification,
        clearNotifications,
        requestNotificationPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
