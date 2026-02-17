import { useState, useEffect } from "react";

/**
 * 🌐 useOnlineStatus Hook
 *
 * Monitors network connectivity and provides real-time online/offline status.
 * Listens to browser's online/offline events and updates state accordingly.
 *
 * @returns {boolean} isOnline - true if connected, false if offline
 *
 * @example
 * const isOnline = useOnlineStatus();
 * {!isOnline && <OfflineBanner />}
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};
