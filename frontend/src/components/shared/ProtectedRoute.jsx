import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Purpose: Protects routes that require authentication
 * 
 * Flow:
 * 1. Check if user is authenticated
 * 2. If authenticated → render the requested component
 * 3. If not authenticated → redirect to /auth (login page)
 * 
 * Usage:
 * <Route path="/customer/*" element={<ProtectedRoute><CustomerRoutes /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
