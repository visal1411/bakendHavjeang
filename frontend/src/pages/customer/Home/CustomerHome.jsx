import { useState, useCallback, useMemo } from 'react';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { pageTransition } from '@/lib/animations';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import 'leaflet/dist/leaflet.css';

// Custom Hooks
import { useLocation } from './hooks/useLocation';
import { useMechanics } from './hooks/useMechanics';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useSavedMechanics } from './hooks/useSavedMechanics';
import { useServiceRequest } from './hooks/useServiceRequest';
import { useBottomSheet } from './hooks/useBottomSheet';
import { useMapControl } from './hooks/useMapControl';

// Components
import { Sidebar } from './components/Sidebar';
import { ExploreView } from './components/ExploreView';
import HistoryPage from '@/pages/customer/History/History';
import SavedPage from '@/pages/customer/Saved/Saved';

/**
 * 🏗️ Hav Jeang – Customer Home Page
 * 
 * Product Goal: Allow customers to discover and request mechanic services in <5 seconds
 * Design Philosophy: Map-first, emergency-ready, minimal cognitive load
 * 
 * Complete Service Request Workflow:
 * 1. Customer selects mechanic from map/list
 * 2. Customer specifies service needs or describes issue
 * 3. Trip fee calculated based on distance
 * 4. Mechanic notified in real-time
 * 5. Mechanic accepts/denies request
 * 6. Customer notified of acceptance
 * 7. Status tracking (accepted → departure → arrival → servicing)
 * 8. Mechanic assesses & proposes service fee (on-site)
 * 9. Customer accepts/denies fee proposal
 * 10. Grand total calculated after service
 * 
 * Key Principles:
 * ✅ 80% map visibility
 * ✅ Icon-based UI (Lucide icons)
 * ✅ Minimal shadows, flat design
 * ✅ Emergency-first service categories
 * ✅ 2-state bottom sheet (collapsed/expanded)
 * ✅ Outdoor-readable contrast
 * ✅ Khmer + English typography
 * ✅ Graceful degradation (GPS denied, offline, no mechanics)
 * 
 * Target: Mid-range smartphones, unstable internet, stressed users
 */
const CustomerHome = () => {
  // === CORE DATA HOOKS ===
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('emergency');
  const [maxDistance, setMaxDistance] = useState(null); // null = no limit, or set to 5 for 5km radius
  const mechanics = useMechanics(searchQuery, selectedCategory, location.userLocation, maxDistance);
  const savedMechanics = useSavedMechanics();
  
  // === FEATURE HOOKS ===
  const map = useMapControl();
  const serviceRequest = useServiceRequest(location.userLocation);
  const bottomSheet = useBottomSheet();
  
  // === UI STATE ===
  const [activeTab, setActiveTab] = useState('explore');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Combined loading state - Prevents null/undefined errors
  const isLoading = location?.isLoading || mechanics?.isLoading || false;

  // === OPTIMIZED HANDLERS WITH useCallback ===
  // Prevents unnecessary re-renders by memoizing callback functions
  
  /**
   * Handler for selecting a mechanic from the map or list
   * Opens service request modal and focuses map on selected mechanic
   * @param {Object} mechanic - The selected mechanic object
   */
  const handleMechanicSelect = useCallback((mechanic) => {
    if (!mechanic) {
      console.warn('No mechanic selected');
      return;
    }
    
    try {
      serviceRequest.openServiceRequest(mechanic);
      map.focusOnMechanic(mechanic);
    } catch (error) {
      console.error('Error selecting mechanic:', error);
    }
  }, [serviceRequest, map]);

  /**
   * Toggle sidebar open/close state
   */
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  /**
   * Close sidebar
   */
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  /**
   * Handle tab changes (explore, history, saved)
   * @param {string} tab - The tab name to switch to
   */
  const handleTabChange = useCallback((tab) => {
    if (!tab) {
      console.warn('No tab specified');
      return;
    }
    setActiveTab(tab);
  }, []);

  /**
   * Recenter map to user's current location
   */
  const handleRecenterMap = useCallback(() => {
    if (location?.userLocation) {
      map.recenterToUser(location.userLocation);
    }
  }, [location?.userLocation, map]);

  // === RENDER CONTENT ===
  /**
   * Renders the appropriate page content based on active tab
   * Memoized to prevent unnecessary re-renders
   */
  const renderContent = useMemo(() => {
    // History Page
    if (activeTab === 'history') {
      return (
        <motion.div key="history" {...pageTransition}>
          <ErrorBoundary>
            <HistoryPage />
          </ErrorBoundary>
        </motion.div>
      );
    }
    
    // Saved Mechanics Page
    if (activeTab === 'saved') {
      return (
        <motion.div key="saved" {...pageTransition}>
          <ErrorBoundary>
            <SavedPage />
          </ErrorBoundary>
        </motion.div>
      );
    }
    
    // Explore View - Main map interface
    // Props are grouped into logical objects for better code organization
    return (
      <motion.div key="explore" {...pageTransition}>
        <ErrorBoundary>
          <ExploreView
            // Location data and permissions
            location={{
              isOnline,
              isLoading,
              permission: location?.locationPermission || 'prompt',
              retry: location?.retryLocation || (() => {}),
              userLocation: location?.userLocation || null
            }}
            // Map state and controls
            map={{
              mapRef: map?.mapRef || null,
              center: map?.mapCenter || [11.5564, 104.9282], // Default to Phnom Penh
              zoom: map?.mapZoom || 13,
              recenter: handleRecenterMap
            }}
            // Mechanics data and filtering
            mechanics={{
              filtered: mechanics?.filteredMechanics || [],
              available: mechanics?.availableMechanics || [],
              searchQuery: searchQuery || '',
              setSearchQuery,
              selectedCategory: selectedCategory || 'emergency',
              onCategorySelect: setSelectedCategory
            }}
            // Service request state
            serviceRequest={{
              show: serviceRequest?.showServiceRequest || false,
              mechanic: serviceRequest?.selectedMechanic || null,
              tripFee: serviceRequest?.calculatedTripFee || 0,
              services: serviceRequest?.selectedServices || [],
              description: serviceRequest?.serviceDescription || '',
              photos: serviceRequest?.photos || [],
              onClose: serviceRequest?.closeServiceRequest || (() => {}),
              onServiceToggle: serviceRequest?.toggleServiceType || (() => {}),
              onDescriptionChange: serviceRequest?.setServiceDescription || (() => {}),
              onAddPhoto: serviceRequest?.addPhoto || (() => {}),
              onRemovePhoto: serviceRequest?.removePhoto || (() => {}),
              onSubmit: serviceRequest?.submitServiceRequest || (() => {})
            }}
            // Bottom sheet controls
            bottomSheet={{
              ref: bottomSheet?.bottomSheetRef || null,
              state: bottomSheet?.bottomSheetState || 'collapsed',
              handlers: {
                onDragStart: bottomSheet?.handleDragStart || (() => {}),
                onDragMove: bottomSheet?.handleDragMove || (() => {}),
                onDragEnd: bottomSheet?.handleDragEnd || (() => {}),
                onToggle: bottomSheet?.toggleBottomSheet || (() => {})
              },
              getHeight: bottomSheet?.getBottomSheetHeight || (() => 0)
            }}
            // UI controls
            ui={{
              toggleSidebar,
              onMechanicSelect: handleMechanicSelect,
              isSaved: savedMechanics?.isMechanicSaved || (() => false),
              toggleSave: savedMechanics?.toggleSaveMechanic || (() => {})
            }}
          />
        </ErrorBoundary>
      </motion.div>
    );
  }, [
    activeTab,
    isOnline,
    isLoading,
    location?.locationPermission,
    location?.retryLocation,
    location?.userLocation,
    map?.mapRef,
    map?.mapCenter,
    map?.mapZoom,
    handleRecenterMap,
    mechanics?.filteredMechanics,
    mechanics?.availableMechanics,
    searchQuery,
    selectedCategory,
    serviceRequest?.showServiceRequest,
    serviceRequest?.selectedMechanic,
    serviceRequest?.calculatedTripFee,
    serviceRequest?.selectedServices,
    serviceRequest?.serviceDescription,
    serviceRequest?.photos,
    serviceRequest?.closeServiceRequest,
    serviceRequest?.toggleServiceType,
    serviceRequest?.setServiceDescription,
    serviceRequest?.addPhoto,
    serviceRequest?.removePhoto,
    serviceRequest?.submitServiceRequest,
    bottomSheet?.bottomSheetRef,
    bottomSheet?.bottomSheetState,
    bottomSheet?.handleDragStart,
    bottomSheet?.handleDragMove,
    bottomSheet?.handleDragEnd,
    bottomSheet?.toggleBottomSheet,
    bottomSheet?.getBottomSheetHeight,
    toggleSidebar,
    handleMechanicSelect,
    savedMechanics?.isMechanicSaved,
    savedMechanics?.toggleSaveMechanic
  ]);

  return (
    <ErrorBoundary>
      <div className="relative w-full h-screen overflow-hidden bg-gray-50">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Hamburger Menu Button - Only show when not in explore view */}
        <AnimatePresence>
          {activeTab !== 'explore' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed top-4 left-4 z-40 safe-area-top"
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={toggleSidebar}
                  className="shadow-lg hover:shadow-xl transition-shadow min-w-[44px] min-h-[44px]"
                  aria-label="Open menu"
                  aria-expanded={isSidebarOpen}
                  aria-controls="sidebar-navigation"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated page content with error boundaries */}
        <AnimatePresence mode="wait">
          {renderContent}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default CustomerHome;
