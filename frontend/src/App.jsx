import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/auth/AuthPage';
import CustomerHome from './pages/customer/Home/CustomerHome';
import MechanicDashboard from './pages/mechanic/Dashboard/MechanicDashboard';
import RoleBasedRoute from './components/shared/RoleBasedRoute';

/**
 * App Component - Main Application Router
 * 
 * Routing Structure:
 * 
 * /auth
 *   - Authentication page (login/signup)
 *   - Users select their role and enter credentials
 *   - After successful auth, redirected based on role
 * 
 * /customer/*
 *   - Routes for customers
 *   - Protected by role-based authentication
 *   - /customer/home - Customer home page (placeholder)
 * 
 * /mechanic/*
 *   - Routes for mechanics
 *   - Protected by role-based authentication
 *   - /mechanic/dashboard - Mechanic dashboard (placeholder)
 * 
 * / (root)
 *   - Redirects to appropriate page based on authentication status:
 *     • Not authenticated → /auth
 *     • Authenticated as Customer → /customer/home
 *     • Authenticated as Mechanic → /mechanic/dashboard
 * 
 * Future Expansion:
 * - Add more customer routes under /customer/* (e.g., /customer/mechanics, /customer/requests)
 * - Add more mechanic routes under /mechanic/* (e.g., /mechanic/services, /mechanic/requests)
 * - Add shared routes if needed (e.g., /profile, /settings)
 */

// Root redirect component - handles initial navigation
const RootRedirect = () => {
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

  // Redirect based on user role
  if (user?.role === 'customer') {
    return <Navigate to="/customer/home" replace />;
  } else if (user?.role === 'mechanic') {
    return <Navigate to="/mechanic/dashboard" replace />;
  }

  return <Navigate to="/auth" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root route - intelligent redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authentication route */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Customer routes - role-based protected */}
          <Route 
            path="/customer/home" 
            element={
              <RoleBasedRoute allowedRole="customer">
                <CustomerHome />
              </RoleBasedRoute>
            } 
          />

          {/* Mechanic routes - role-based protected */}
          <Route 
            path="/mechanic/dashboard" 
            element={
              <RoleBasedRoute allowedRole="mechanic">
                <MechanicDashboard />
              </RoleBasedRoute>
            } 
          />

          {/* Catch-all route - redirect to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
