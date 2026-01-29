// Web Push Notification Service
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

/**
 * Convert VAPID public key from base64 URL-safe to Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Register service worker for push notifications
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    console.log('✅ Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('❌ Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied');
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(registration) {
  if (!VAPID_PUBLIC_KEY) {
    console.error('VAPID_PUBLIC_KEY is not set in environment variables');
    return null;
  }

  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Convert subscription to format expected by backend
    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
        auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
      },
    };

    return subscriptionData;
  } catch (error) {
    console.error('❌ Push subscription failed:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPush(registration) {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return subscription.endpoint;
    }
    return null;
  } catch (error) {
    console.error('❌ Push unsubscribe failed:', error);
    return null;
  }
}

/**
 * Initialize push notifications (register SW, request permission, subscribe)
 */
export async function initializePushNotifications() {
  // Register service worker
  const registration = await registerServiceWorker();
  if (!registration) {
    return null;
  }

  // Request notification permission
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn('Notification permission not granted');
    return null;
  }

  // Check if already subscribed
  let subscription = await registration.pushManager.getSubscription();
  
  if (!subscription) {
    // Subscribe to push notifications
    const subscriptionData = await subscribeToPush(registration);
    if (!subscriptionData) {
      return null;
    }
    return { registration, subscription: subscriptionData };
  }

  // Already subscribed - convert existing subscription
  const subscriptionData = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
      auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')))),
    },
  };

  return { registration, subscription: subscriptionData };
}
