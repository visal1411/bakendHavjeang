import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Local storage keys
const AUTH_STORAGE_KEY = 'hav_jeang_auth';
const USER_STORAGE_KEY = 'hav_jeang_user';

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
    const restoreAuth = () => {
      try {
        const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (storedAuth === 'true' && storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          console.log('✅ Session restored:', userData.role);
        } else {
          console.log('ℹ️ No active session found');
        }
      } catch (error) {
        console.error('❌ Error restoring session:', error);
        // Clear corrupted data
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = (userData) => {
    // userData should contain: { phone, role, ... }
    try {
      setUser(userData);
      setIsAuthenticated(true);
      
      // Persist to localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      
      console.log('✅ User logged in:', userData.role);
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
