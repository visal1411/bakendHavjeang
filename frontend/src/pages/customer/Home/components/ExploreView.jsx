import { AnimatePresence } from 'framer-motion';
import { OfflineBanner } from './OfflineBanner';
import { LoadingState } from './LoadingState';
import { InteractiveMap } from './InteractiveMap';
import { SearchBar } from './SearchBar';
import { RecenterButton } from './RecenterButton';
import { ServiceRequestModal } from './ServiceRequestModal';
import { BottomSheet } from './BottomSheet';
import { LocationStatusIndicator } from './LocationStatusIndicator';

/**
 * ExploreView Component
 * 
 * Main explore view that coordinates the map, search, and mechanics list.
 * This is the primary interface for customers to find and request mechanic services.
 * 
 * Features:
 * - Interactive map with mechanic markers
 * - Real-time search and filtering
 * - Service request modal
 * - Bottom sheet for mechanic list
 * - Offline/online detection
 * - Location permission handling
 * 
 * @param {Object} location - Location state and handlers
 * @param {boolean} location.isOnline - Network connection status
 * @param {boolean} location.isLoading - Location loading state
 * @param {string} location.permission - Location permission status ('granted', 'denied', 'prompt')
 * @param {Function} location.retry - Function to retry location permission
 * @param {Object|null} location.userLocation - User's current location {lat, lng}
 * 
 * @param {Object} map - Map state and controls
 * @param {Object} map.mapRef - Reference to the Leaflet map instance
 * @param {Array} map.center - Map center coordinates [lat, lng]
 * @param {number} map.zoom - Map zoom level
 * @param {Function} map.recenter - Function to recenter map to user location
 * 
 * @param {Object} mechanics - Mechanics data and filters
 * @param {Array} mechanics.filtered - Filtered mechanics based on search/category
 * @param {Array} mechanics.available - All available mechanics
 * @param {string} mechanics.searchQuery - Current search query
 * @param {Function} mechanics.setSearchQuery - Function to update search query
 * @param {string} mechanics.selectedCategory - Selected service category
 * @param {Function} mechanics.onCategorySelect - Function to update category
 * 
 * @param {Object} serviceRequest - Service request state and handlers
 * @param {boolean} serviceRequest.show - Whether to show service request modal
 * @param {Object|null} serviceRequest.mechanic - Selected mechanic data
 * @param {number} serviceRequest.tripFee - Calculated trip fee
 * @param {Array} serviceRequest.services - Selected services
 * @param {string} serviceRequest.description - Service description
 * @param {Function} serviceRequest.onClose - Function to close modal
 * @param {Function} serviceRequest.onServiceToggle - Function to toggle service selection
 * @param {Function} serviceRequest.onDescriptionChange - Function to update description
 * @param {Function} serviceRequest.onSubmit - Function to submit service request
 * 
 * @param {Object} bottomSheet - Bottom sheet state and handlers
 * @param {Object} bottomSheet.ref - Reference to bottom sheet element
 * @param {string} bottomSheet.state - Bottom sheet state ('collapsed', 'expanded')
 * @param {Object} bottomSheet.handlers - Drag and toggle handlers
 * @param {Function} bottomSheet.getHeight - Function to get bottom sheet height
 * 
 * @param {Object} ui - UI state and handlers
 * @param {Function} ui.toggleSidebar - Function to toggle sidebar
 * @param {Function} ui.onMechanicSelect - Function called when mechanic is selected
 * @param {Function} ui.isSaved - Function to check if mechanic is saved
 * @param {Function} ui.toggleSave - Function to toggle save status
 */
export const ExploreView = ({
  // Location
  location: { isOnline, isLoading, permission, retry, userLocation },
  
  // Map
  map: { mapRef, center, zoom, recenter },
  
  // Mechanics
  mechanics: { filtered, available, searchQuery, setSearchQuery, selectedCategory, onCategorySelect },
  
  // Service Request
  serviceRequest: { 
    show, 
    mechanic, 
    tripFee, 
    services, 
    description,
    photos,
    onClose, 
    onServiceToggle, 
    onDescriptionChange,
    onAddPhoto,
    onRemovePhoto,
    onSubmit 
  },
  
  // Bottom Sheet
  bottomSheet: { ref, state, handlers, getHeight },
  
  // UI
  ui: { toggleSidebar, onMechanicSelect, isSaved, toggleSave }
}) => {
  // Safety checks to prevent crashes
  const safeFiltered = Array.isArray(filtered) ? filtered : [];
  const safeAvailable = Array.isArray(available) ? available : [];
  const safeCenter = Array.isArray(center) && center.length === 2 ? center : [11.5564, 104.9282];
  const safeZoom = typeof zoom === 'number' ? zoom : 13;

  return (
    <>
      {/* Network Status Banner */}
      <OfflineBanner isOnline={isOnline} />

      {/* Location Status Indicator - Always visible in top-right */}
      {!isLoading && (
        <LocationStatusIndicator 
          permission={permission}
          onEnableLocation={retry}
          isLoading={isLoading}
        />
      )}

      {/* Map Container - Always show map, even without location permission */}
      <div className="absolute inset-0 z-0" role="main" aria-label="Map view">
        {isLoading ? (
          <LoadingState />
        ) : (
          <InteractiveMap
            mapRef={mapRef}
            mapCenter={safeCenter}
            mapZoom={safeZoom}
            userLocation={permission === 'granted' ? userLocation : null}
            mechanics={safeFiltered}
            onMechanicSelect={onMechanicSelect}
          />
        )}
      </div>

      {/* Search Bar with Category Filters */}
      <SearchBar
        searchQuery={searchQuery || ''}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory || 'emergency'}
        onCategorySelect={onCategorySelect}
        onMenuClick={toggleSidebar}
        onMechanicSelect={onMechanicSelect}
      />

      {/* Recenter Map Button - Only show when user location is available */}
      {userLocation && permission === 'granted' && <RecenterButton onClick={recenter} />}

      {/* Service Request Modal - Animated entry/exit */}
      <AnimatePresence>
        {show && mechanic && (
          <ServiceRequestModal
            mechanic={mechanic}
            calculatedTripFee={tripFee || 0}
            selectedServices={services || []}
            serviceDescription={description || ''}
            photos={photos || []}
            onClose={onClose}
            onServiceToggle={onServiceToggle}
            onDescriptionChange={onDescriptionChange}
            onAddPhoto={onAddPhoto}
            onRemovePhoto={onRemovePhoto}
            onSubmit={onSubmit}
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet - Mechanics List */}
      <BottomSheet
        bottomSheetRef={ref}
        bottomSheetState={state || 'collapsed'}
        filteredMechanics={safeFiltered}
        availableMechanics={safeAvailable}
        onDragStart={handlers?.onDragStart || (() => {})}
        onDragMove={handlers?.onDragMove || (() => {})}
        onDragEnd={handlers?.onDragEnd || (() => {})}
        onToggle={handlers?.onToggle || (() => {})}
        onMechanicSelect={onMechanicSelect}
        isMechanicSaved={isSaved || (() => false)}
        onToggleSave={toggleSave || (() => {})}
        getBottomSheetHeight={getHeight || (() => 0)}
      />
    </>
  );
};
