/**
 * CustomerHome Module Exports
 * Clean, organized exports for better developer experience
 */

// === DEFAULT EXPORT ===
export { default } from "./CustomerHome";

// === NAMED COMPONENT EXPORTS ===
export { default as CustomerHomeRefactored } from "./CustomerHomeRefactored";

// UI Components
export { ExploreView } from "./components/ExploreView";
export { Sidebar } from "./components/Sidebar";
export { MechanicCard } from "./components/MechanicCard";
export { BottomSheet } from "./components/BottomSheet";
export { SearchBar } from "./components/SearchBar";
export { ServiceRequestModal } from "./components/ServiceRequestModal";
export { InteractiveMap } from "./components/InteractiveMap";
export { LoadingState } from "./components/LoadingState";
export { SkeletonCard, SkeletonList } from "./components/SkeletonCard";
export { LocationDeniedState } from "./components/LocationDeniedState";
export { OfflineBanner } from "./components/OfflineBanner";
export { RecenterButton } from "./components/RecenterButton";

// === CUSTOM HOOKS ===
// Data hooks
export { useLocation } from "./hooks/useLocation";
export { useMechanics } from "./hooks/useMechanics";
export { useOnlineStatus } from "./hooks/useOnlineStatus";
export { useSavedMechanics } from "./hooks/useSavedMechanics";

// Feature hooks
export { useServiceRequest } from "./hooks/useServiceRequest";
export { useBottomSheet } from "./hooks/useBottomSheet";
export { useMapControl } from "./hooks/useMapControl";

// === UTILITIES ===
export { calculateTripFee, handleLogout } from "./utils/helpers";
export { createCustomIcon, userLocationIcon } from "./utils/mapIcons";
