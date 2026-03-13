import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services';

const AuthContext = createContext(null);

// Local storage keys
const AUTH_STORAGE_KEY = 'hav_jeang_auth';
const USER_STORAGE_KEY = 'hav_jeang_user';
const TOKEN_STORAGE_KEY = 'hav_jeang_token';

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

  // Restore authentication state on mount and validate with backend
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (token && storedUser) {
          // Verify token with backend
          try {
            const sessionData = await authService.checkSession();
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);

          } catch (error) {

            // Token invalid or expired, clear everything
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(USER_STORAGE_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
          }
        } else {

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

  const login = (userData, token) => {
    // userData should contain: { id, name, phone, usertype, ... }
    // token is the JWT from backend
    try {
      setUser(userData);
      setIsAuthenticated(true);
      
      // Persist to localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
      

    } catch (error) {
      console.error('❌ Error saving session:', error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      
      // Clear from localStorage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      
      // Also clear from authService
      authService.logout();
      

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
