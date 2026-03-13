import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  DollarSign,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  XCircle
} from 'lucide-react';

// Components
import { StatsCard } from './StatsCard';
import { ServiceRequestCard } from './ServiceRequestCard';
import { AvailabilityToggle } from './AvailabilityToggle';
import { EarningsSummary } from './EarningsSummary';
import { ServiceRequestDetailModal } from './ServiceRequestDetailModal';

// Hooks
import { useMechanicStats, useServiceRequests, useAvailability } from '../../hooks';

/**
 * DashboardOverview Component
 * 
 * Main dashboard view with stats, requests, and earnings
 */
export const DashboardOverview = () => {
  const { stats, isLoading: statsLoading, refreshStats } = useMechanicStats();
  const {
    requests,
    counts,
    filter,
    setFilter,
    acceptRequest,
    declineRequest,
    updateRequestStatus,
    proposePrice,
    refreshRequests,
    isLoading: requestsLoading
  } = useServiceRequests();
  const { isAvailable, toggleAvailability } = useAvailability();

  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setFilter(selectedTab);
  }, [selectedTab, setFilter]);

  const handleAcceptRequest = async (requestId) => {
    const result = await acceptRequest(requestId);
    if (result.success) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      // Switch to the accepted tab to show the accepted request
      setSelectedTab('accepted');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    await declineRequest(requestId);
  };

  const handleCompleteRequest = async (requestId) => {
    const result = await updateRequestStatus(requestId, 'completed');
    if (result.success) {
      setSelectedTab('completed');
    }
  };

  const handleUpdateStatus = async (requestId, newStatus) => {
    const result = await updateRequestStatus(requestId, newStatus);
    if (result.success) {
      const updatedRequest = requests.find(r => r.id === requestId);
      if (updatedRequest && selectedRequest?.id === requestId) {
        setSelectedRequest({ ...updatedRequest, status: newStatus });
      }
    }
  };

  const handleViewDetails = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
    }
  };



  const handleRefresh = async () => {
    await Promise.all([refreshStats(), refreshRequests()]);
  };

  const handleAvailabilityToggle = () => {
    // Handled by AvailabilityToggle's internal state + localStorage
  };

  const tabs = [
    { id: 'pending', label: 'New Requests', count: counts.pending || 0, color: 'yellow', icon: AlertCircle },
    { id: 'proposed', label: 'Proposed', count: counts.proposed || 0, color: 'orange', icon: Clock },
    { id: 'accepted', label: 'Accepted', count: counts.accepted || 0, color: 'blue', icon: CheckCircle },
    { id: 'cancelled', label: 'Cancelled', count: counts.cancelled || 0, color: 'red', icon: XCircle }
  ];

  return (
    <>
      {/* Success Message Banner */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded-xl flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-green-800 font-bold">Job Accepted!</p>
              <p className="text-sm text-green-700">The customer has been notified and is expecting you.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Service Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon={Briefcase}
              label="Service Requests"
              value={stats?.totalJobs || 0}
              subValue={`${stats?.completedJobs || 0} completed`}
            />
            <StatsCard
              icon={Star}
              label="Rating"
              value={stats?.rating || 0}
              subValue={`${stats?.totalReviews || 0} reviews`}
            />
            <StatsCard
              icon={DollarSign}
              label="Total Earnings"
              value={`$${stats?.totalEarnings?.toFixed(2) || '0.00'}`}
              trend={{ type: 'up', value: '12%' }}
            />
            <StatsCard
              icon={TrendingUp}
              label="Completion Rate"
              value={`${stats?.completionRate || 0}%`}
              subValue="Last 30 days"
            />
          </div>

          {/* Service Requests Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Service Requests</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={statsLoading || requestsLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 text-gray-600 ${(statsLoading || requestsLoading) ? 'animate-spin' : ''}`}
                  />
                </button>
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-600">
                  {counts.pending} pending
                </span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setSelectedTab(tab.id);
                    }}
                    className={`
                      p-4 rounded-xl text-left transition-all border-2
                      ${isActive
                        ? 'bg-primary text-white border-primary shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      {tab.count > 0 && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                    <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-gray-900'}`}>
                      {tab.label}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Requests List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {requestsLoading ? (
                <div className="text-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Loading requests...</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No {selectedTab} requests</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedTab === 'pending'
                      ? 'New requests will appear here'
                      : `You have no ${selectedTab} service requests`
                    }
                  </p>
                </div>
              ) : (
                requests.map(request => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ServiceRequestCard
                      request={request}
                      onAccept={handleAcceptRequest}
                      onDecline={handleDeclineRequest}
                      onComplete={handleCompleteRequest}
                      onViewDetails={handleViewDetails}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Availability, Earnings, Performance */}
        <div className="space-y-6">
          {/* Availability Toggle */}
          <AvailabilityToggle
            initialAvailable={isAvailable}
            onToggle={handleAvailabilityToggle}
          />

          {/* Earnings Summary */}
          <EarningsSummary totalEarnings={stats?.totalEarnings || 0} />

          {/* Performance Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-bold text-gray-900">
                  {stats?.responseTime || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Work Hours</span>
                <span className="text-sm font-bold text-gray-900">
                  {stats?.availabilityHours || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled Requests</span>
                <span className="text-sm font-bold text-red-600">
                  {stats?.cancelledJobs || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Request Detail Modal */}
      {selectedRequest && (
        <ServiceRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={handleUpdateStatus}
          onProposePrice={proposePrice}
        />
      )}
    </>
  );
};
