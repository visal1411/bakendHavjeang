import { useState } from 'react';
import { Bell, CheckCheck, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { useNotifications } from '@/contexts/useNotifications';
import { useAuth } from '@/contexts/AuthContext';

const NotificationCenter = () => {
  const { isAuthenticated } = useAuth();
  const {
    notifications,
    unreadCount,
    markAllRead,
    dismissNotification,
  } = useNotifications();
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        <button
          type="button"
          className="relative rounded-full bg-white p-2 shadow-md border border-gray-200 hover:bg-gray-50"
          onClick={() => setIsPanelOpen((open) => !open)}
          aria-label="Open notifications"
        >
          <Bell className="h-5 w-5 text-gray-800" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 text-xs font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isPanelOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="fixed right-4 top-16 z-50 w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              <button
                type="button"
                onClick={markAllRead}
                className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 && (
                <p className="px-4 py-6 text-sm text-gray-500">No notifications yet.</p>
              )}

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-100 px-4 py-3 ${
                    notification.isRead ? 'bg-white' : 'bg-blue-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                      <p className="mt-1 text-sm text-gray-700">{notification.message}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dismissNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Dismiss notification"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed right-4 top-20 z-40 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        <AnimatePresence>
          {notifications.filter((notification) => !notification.isRead).slice(0, 3).map((notification) => (
            <Motion.div
              key={`toast-${notification.id}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              className="pointer-events-auto rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-lg"
            >
              <p className="text-xs font-semibold text-gray-900">{notification.title}</p>
              <p className="text-xs text-gray-700">{notification.message}</p>
            </Motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

export default NotificationCenter;
