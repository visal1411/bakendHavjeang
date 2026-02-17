import { useState } from 'react';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Components
import { MechanicSidebar } from '../components/shared';
import { DashboardOverview } from '../components/dashboard';
import { ServicesManagement } from '../components/services';
import { ServiceHistory } from '../components/history';
import { MechanicProfile } from '../components/profile';

/**
 * 🔧 Mechanic Dashboard
 * 
 * Central hub for mechanics with:
 * - Dashboard: Overview, stats, and service requests
 * - Services: CRUD for service offerings
 * - History: Past completed jobs
 */
const MechanicDashboard = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard'); // dashboard, services, history

  const sectionTitles = {
    dashboard: 'Dashboard',
    services: 'Services Management',
    history: 'Service History',
    profile: 'Profile',
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'services':
        return <ServicesManagement />;
      case 'history':
        return <ServiceHistory />;
      case 'profile':
        return <MechanicProfile />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {sectionTitles[activeSection]}
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.name || 'Mechanic'}!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderSection()}
      </div>

      {/* Sidebar */}
      <MechanicSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
    </div>
  );
};

export default MechanicDashboard;
