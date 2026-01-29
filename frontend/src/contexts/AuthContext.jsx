import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../lib/api';
import { pushAPI } from '../lib/api';
import { initializePushNotifications } from '../lib/pushNotifications';

const AuthContext = createContext(null);

// Local storage keys
const AUTH_STORAGE_KEY = 'hav_jeang_auth';
const USER_STORAGE_KEY = 'hav_jeang_user';
const TOKEN_STORAGE_KEY = 'auth_token';

/**
 * AuthProvider Component
 * 
 * Provides authentication state and methods throughout the app.
 * Persists authentication state in localStorage so users stay logged in
 * even after page reload or browser restart.
 * 
 * Features:
 * - Persistent login (survives page reload)
 * - Secure logout (clears all stored data)
 * - Automatic session restoration on app load
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authentication state on mount
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

        if (storedAuth === 'true' && storedUser && storedToken) {
          // Verify token is still valid
          try {
            const response = await authAPI.checkSession();
            const userData = response.data.user || JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
            console.log('✅ Session restored:', userData.usertype || userData.role);
            
            // Initialize push notifications
            try {
              const pushData = await initializePushNotifications();
              if (pushData?.subscription) {
                await pushAPI.subscribe(pushData.subscription);
                console.log('✅ Push notifications subscribed');
              }
            } catch (pushError) {
              console.warn('⚠️ Push notification setup failed:', pushError);
            }
          } catch (error) {
            // Token invalid, clear session
            console.log('❌ Session expired, clearing auth');
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        } else {
          console.log('ℹ️ No active session found');
        }
      } catch (error) {
        console.error('❌ Error restoring session:', error);
        // Clear corrupted data
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = async (userData, token) => {
    // userData should contain: { id, phone, usertype, ... }
    // token is the JWT token from backend
    try {
      setUser(userData);
      setIsAuthenticated(true);
      
      // Persist to localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
      
      console.log('✅ User logged in:', userData.usertype || userData.role);

      // Initialize push notifications after login
      try {
        const pushData = await initializePushNotifications();
        if (pushData?.subscription) {
          await pushAPI.subscribe(pushData.subscription);
          console.log('✅ Push notifications subscribed');
        }
      } catch (pushError) {
        console.warn('⚠️ Push notification setup failed:', pushError);
      }
    } catch (error) {
      console.error('❌ Error saving session:', error);
    }
  };

  const logout = async () => {
    try {
      // Unsubscribe from push notifications
      try {
        const registration = await navigator.serviceWorker?.ready;
        if (registration) {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            await pushAPI.unsubscribe(subscription.endpoint);
          }
        }
      } catch (pushError) {
        console.warn('⚠️ Push unsubscribe failed:', pushError);
      }

      setUser(null);
      setIsAuthenticated(false);
      
      // Clear from localStorage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      
      console.log('✅ User logged out');
    } catch (error) {
      console.error('❌ Error clearing session:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
