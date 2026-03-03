import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from 'lucide-react';

/**
 * Clean Location Status Indicator
 * 
 * Minimalist location status with clean design for mobile and web
 * Shows status in top-right, prominent enable button when needed
 * 
 * Design Principles:
 * - Ultra-minimal and clean
 * - Responsive for mobile and desktop
 * - Clear call-to-action
 * - Modern flat design
 * 
 * @param {Object} props
 * @param {string} props.permission - Location permission status ('granted', 'denied', 'pending')
 * @param {Function} props.onEnableLocation - Callback to request location
 * @param {boolean} props.isLoading - Whether location request is in progress
 */
export const LocationStatusIndicator = ({ permission, onEnableLocation, isLoading = false }) => {
  const isOn = permission === 'granted';
  const isDenied = permission === 'denied';

  // Only show compact status indicator (Live/Off) in top-right
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed top-3 right-3 md:top-4 md:right-4 z-40 safe-area-top"
    >
      {isOn ? (
        <div className="bg-white rounded-full px-2.5 py-1.5 md:px-3 md:py-2 shadow-sm border border-gray-100 flex items-center gap-1.5">
          <motion.div 
            className="w-1.5 h-1.5 bg-green-500 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <span className="text-[10px] md:text-xs font-medium text-gray-600">
            Live
          </span>
        </div>
      ) : (
        <div className="bg-white rounded-full px-2.5 py-1.5 md:px-3 md:py-2 shadow-sm border border-gray-100 flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          <span className="text-[10px] md:text-xs font-medium text-gray-500">
            Off
          </span>
        </div>
      )}
    </motion.div>
  );
};
