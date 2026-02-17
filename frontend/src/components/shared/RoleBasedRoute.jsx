import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * RoleBasedRoute Component
 * 
 * Purpose: Route users to appropriate pages based on their role
 * 
 * Flow:
 * 1. Check if authentication is loading
 * 2. Check user authentication status
 * 3. Check user role (customer or mechanic)
 * 4. If user role matches allowedRole → render component
 * 5. If user role doesn't match → redirect to their appropriate home
 * 6. If not authenticated → redirect to /auth
 * 
 * Role Routing Logic:
 * - Customer role → /customer/home
 * - Mechanic role → /mechanic/dashboard
 * 
 * Usage:
 * <Route path="/customer/home" element={<RoleBasedRoute allowedRole="customer"><CustomerHome /></RoleBasedRoute>} />
 */
const RoleBasedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to appropriate home based on user role
  if (user?.role !== allowedRole) {
    if (user?.role === 'customer') {
      return <Navigate to="/customer/home" replace />;
    } else if (user?.role === 'mechanic') {
      return <Navigate to="/mechanic/dashboard" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
